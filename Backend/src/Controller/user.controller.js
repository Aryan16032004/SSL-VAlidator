import forge from 'node-forge'
import https from 'https'
import axios from "axios"
import tls from "tls"

const getCertificateDetails = (domain) => {
    return new Promise((resolve, reject) => {
      const options = {
        host: domain,
        port: 443,
        method: 'GET',
        rejectUnauthorized: false,
        agent: new https.Agent({ maxCachedSessions: 0 }),
      };
  
      const req = https.request(options, (res) => {
        const cert = res.connection.getPeerCertificate();
        if (Object.keys(cert).length === 0) {
          reject('No certificate found');
        } else {
          resolve(cert);
        }
      });
  
      req.on('error', (e) => {
        reject(e);
      });
  
      req.end();
    });
  };

//   const checkOCSPStatus = async (certificate) => {
//     try {
//       const response = await axios.get(`https://ocsp.example.com/check?cert=${certificate}`);
//       return response.data.status === 'good'; // Example check
//     } catch (error) {
//       console.error("Error checking OCSP status:", error);
//       return false;
//     }
//   };
  
  // Endpoint to fetch SSL certificate and metadata
  const validateDomain= async (req, res) => {
    const { domain } = req.body;
  
    try {
      // Fetch SSL Certificate Details
      const cert = await getCertificateDetails(domain);
  
      // Certificate chain validation
      const isSelfSigned = cert.issuerCertificate === undefined;

      
      // Extract important details
      const certificateDetails = {
        subject: cert.subject,
        issuer: cert.issuer,
        // valid_from: cert.valid_from,
        expiry_date: cert.valid_to,
        // valid_for: cert.subjectaltname,
        is_self_signed: isSelfSigned,
      };
  
      // Convert valid_to to Date object for expiry check
      const validTo = new Date(cert.valid_to);
      const daysRemaining = Math.floor((validTo - new Date()) / (1000 * 60 * 60 * 24));
      
      // ocsp
    //   const isOCSPValid = await checkOCSPStatus(cert);

      // Validate expiry and status
      const validityStatus = {
        isValid: daysRemaining > 0,
        daysRemaining: daysRemaining,
      };
      
      //subject details
      const subjectDetails = {
        commonName: cert.subject.CN,
        organization: cert.subject.O,
        locality: cert.subject.L,
        country: cert.subject.C,
        // Add more fields as needed
      };

      // CA valid
    //   const isCAValid = trustedCAs.includes(cert.issuer.O);

      // Check if certificate is valid for the domain
      const isValidForDomain = cert.subject.CN === domain || cert.subjectaltname.includes(domain);
  
      // Certificate revocation (simplified - real-world usage requires OCSP/CRL implementation)
      let isRevoked = false;
      // You can extend this with OCSP/CRL check using libraries or custom HTTP requests.
  
      // Final response with metadata and status
      res.json({
        validityStatus,
        certificateDetails,
        isValidForDomain,
        isRevoked,
        // isCAValid,
        // isOCSPValid,
        // subjectDetails
      });
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  };

export {validateDomain}