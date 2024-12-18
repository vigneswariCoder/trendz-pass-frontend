import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Benefits: React.FC = () => {
  const { membershipType } = useParams<Record<string, string | undefined>>();
  const [benefits, setBenefits] = useState<string>('');

  useEffect(() => {
    if (membershipType) {
      axios.get(`/api/customers/benefits/${membershipType}`).then((response) => {
        setBenefits(response.data);
      });
    }
  }, [membershipType]);

  return (
    <div>
      <h1>Membership Benefits</h1>
      <p>{benefits}</p>
    </div>
  );
};

export default Benefits;
