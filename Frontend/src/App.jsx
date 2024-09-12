
// export default App
import axios from "axios";
import { useState } from 'react';

function App() {
  const [domain, setDomain] = useState('');
  const [certificateData, setCertificateData] = useState(null);
  const [visible,setvisible]=useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    setvisible(false)
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/domain', { domain });
      setCertificateData(response.data);
      setLoading(false);
      setvisible(true)
    } catch (err) {
      setError('An error occurred while validating the domain');
      setLoading(false);
      setvisible(false)
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Domain SSL Certificate Validator</h1>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Enter domain name"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="border rounded w-1/2 py-2 px-4 mb-2 m-5"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Validate Domain
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {certificateData && visible && (
        <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Field</th>
              <th className="border border-gray-300 px-4 py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Is Valid</td>
              <td className="border border-gray-300 px-4 py-2">
                {certificateData.validityStatus.isValid ? "Yes" : "No"}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Days Remaining</td>
              <td className="border border-gray-300 px-4 py-2">
                {certificateData.validityStatus.daysRemaining}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Subject CN</td>
              <td className="border border-gray-300 px-4 py-2">
                {certificateData.certificateDetails.subject.CN}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Issuer CN</td>
              <td className="border border-gray-300 px-4 py-2">
                {certificateData.certificateDetails.issuer.CN}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Expiry Date</td>
              <td className="border border-gray-300 px-4 py-2">
                {certificateData.certificateDetails.expiry_date}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Is Self Signed</td>
              <td className="border border-gray-300 px-4 py-2">
                {certificateData.certificateDetails.is_self_signed ? "Yes" : "No"}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Is Valid for Domain</td>
              <td className="border border-gray-300 px-4 py-2">
                {certificateData.isValidForDomain ? "Yes" : "No"}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Is Revoked</td>
              <td className="border border-gray-300 px-4 py-2">
                {certificateData.isRevoked ? "Yes" : "No"}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
