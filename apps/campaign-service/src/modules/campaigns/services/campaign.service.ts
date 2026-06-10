import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CampaignRepository } from '../repositories/campaign.repository';
import { Campaign } from '../entities/campaign.entity';
import { CreateCampaignInput } from '../dto/create-campaign.input';
import { UpdateCampaignInput } from '../dto/update-campaign.input';

/**
 * CampaignService - Business Logic Layer
 * Implements Service Layer Pattern
 * Following SOLID Principles:
 * - Single Responsibility: Handles only campaign business logic
 * - Dependency Inversion: Depends on Repository abstraction
 */
@Injectable()
export class CampaignsService {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  async create(createCampaignDto: CreateCampaignInput): Promise<Campaign> {
    // Validate campaign dates
    this.validateCampaignDates(createCampaignDto.startDate, createCampaignDto.endDate);

    // Validate budget allocation across channels
    this.validateChannelBudgets(createCampaignDto.budget, createCampaignDto.channels);

    const campaignWithDefaults = {
      ...createCampaignDto,
      spent: 0,
      channels: createCampaignDto.channels || [],
      tags: createCampaignDto.tags || [],
    };

    return this.campaignRepository.create(campaignWithDefaults);
  }

  async findAll(tenantId: string): Promise<Campaign[]> {
    return this.campaignRepository.findAll(tenantId);
  }

  async findOne(id: string): Promise<Campaign> {
    const campaign = await this.campaignRepository.findById(id);
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
    return campaign;
  }

  async findByOwner(ownerId: string, tenantId: string): Promise<Campaign[]> {
    return this.campaignRepository.findByOwner(ownerId, tenantId);
  }

  async findByTeam(teamId: string, tenantId: string): Promise<Campaign[]> {
    return this.campaignRepository.findByTeam(teamId, tenantId);
  }

  async findByStatus(status: string, tenantId: string): Promise<Campaign[]> {
    return this.campaignRepository.findByStatus(status, tenantId);
  }

  async searchCampaigns(searchTerm: string, tenantId: string): Promise<Campaign[]> {
    return this.campaignRepository.searchCampaigns(searchTerm, tenantId);
  }

  async update(id: string, updateCampaignDto: UpdateCampaignInput): Promise<Campaign> {
    await this.findOne(id); // Ensure campaign exists

    if (updateCampaignDto.startDate && updateCampaignDto.endDate) {
      this.validateCampaignDates(updateCampaignDto.startDate, updateCampaignDto.endDate);
    }

    if (updateCampaignDto.budget && updateCampaignDto.channels) {
      this.validateChannelBudgets(updateCampaignDto.budget, updateCampaignDto.channels);
    }

    return this.campaignRepository.update(id, updateCampaignDto);
  }

  async remove(id: string): Promise<Campaign> {
    await this.findOne(id); // Ensure campaign exists
    return this.campaignRepository.softDelete(id);
  }

  async getCampaignStats(tenantId: string) {
    return this.campaignRepository.getCampaignStats(tenantId);
  }

  async getChannelPerformance(tenantId: string) {
    return this.campaignRepository.getChannelPerformance(tenantId);
  }

  /**
   * Validate that end date is after start date
   * Demonstrates business logic encapsulation
   */
  private validateCampaignDates(startDate: Date, endDate: Date): void {
    if (new Date(endDate) <= new Date(startDate)) {
      throw new ConflictException('End date must be after start date');
    }
  }

  /**
   * Validate that channel budgets don't exceed total campaign budget
   * Demonstrates business rule enforcement
   */
  private validateChannelBudgets(totalBudget: number, channels: any[]): void {
    if (!channels || channels.length === 0) return;

    const totalChannelBudget = channels.reduce((sum, channel) => sum + channel.budget, 0);
    
    if (totalChannelBudget > totalBudget) {
      throw new ConflictException(
        `Total channel budget (${totalChannelBudget}) cannot exceed campaign budget (${totalBudget})`
      );
    }
  }
}
