import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_CAMPAIGNS = gql`
  query GetCampaigns {
    campaigns {
      _id
      name
      client
      status
      budget
    }
  }
`;

export const CampaignList = () => {
  const { loading, error, data } = useQuery(GET_CAMPAIGNS);

  if (loading) return <p>Loading campaigns...</p>;
  if (error) return <p>Error loading campaigns :(</p>;

  return (
    <div className="campaign-container">
      <h1>Marketing Platform - Active Campaigns</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Client</th>
            <th>Budget</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.campaigns.map((campaign) => (
            <tr key={campaign._id}>
              <td>{campaign.name}</td>
              <td>{campaign.client}</td>
              <td>${campaign.budget.toLocaleString()}</td>
              <td>
                <span className={`status-${campaign.status.toLowerCase()}`}>
                  {campaign.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
