import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_TENANT_CAMPAIGNS = gql`
  query GetCampaigns {
    campaigns {
      _id
      name
      client
      status
      budget
      tenantId
    }
  }
`;

export const PlanManagerUI = () => {
  // Mock Octa ID Selection for Demo
  const [octaId, setOctaId] = useState('marketing-japan-001');

  const { loading, error, data, refetch } = useQuery(GET_TENANT_CAMPAIGNS, {
    context: {
      headers: {
        'x-octa-id': octaId,
      },
    },
  });

  const handleTenantChange = (id: string) => {
    setOctaId(id);
    refetch();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <header style={{ borderBottom: '2px solid #0070f3', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ color: '#0070f3' }}>Marketing Plan Manager</h1>
        <div style={{ alignSelf: 'center' }}>
          <label>Logged in via Octa ID: </label>
          <select value={octaId} onChange={(e) => handleTenantChange(e.target.value)}>
            <option value="marketing-japan-001">Marketing Japan (001)</option>
            <option value="marketing-global-002">Marketing Global (002)</option>
            <option value="marketing-india-003">Marketing India (003)</option>
          </select>
        </div>
      </header>

      {loading && <p>Loading plans for {octaId}...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

      {!loading && !error && (
        <div>
          <h3>Active Plans for Tenant: <span style={{ color: '#0070f3' }}>{octaId}</span></h3>
          <p>This data is strictly isolated via Multi-tenant Backend logic.</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={cellStyle}>Campaign Name</th>
                <th style={cellStyle}>Client</th>
                <th style={cellStyle}>Budget</th>
                <th style={cellStyle}>Tenant ID</th>
                <th style={cellStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.campaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>No campaigns found for this tenant.</td>
                </tr>
              ) : (
                data.campaigns.map((plan) => (
                  <tr key={plan._id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={cellStyle}>{plan.name}</td>
                    <td style={cellStyle}>{plan.client}</td>
                    <td style={cellStyle}>${plan.budget.toLocaleString()}</td>
                    <td style={cellStyle}>{plan.tenantId}</td>
                    <td style={cellStyle}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        background: plan.status === 'ACTIVE' ? '#e6fffa' : '#fff5f5',
                        color: plan.status === 'ACTIVE' ? '#2c7a7b' : '#c53030'
                      }}>
                        {plan.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const cellStyle = {
  padding: '12px',
  textAlign: 'left' as const,
};
