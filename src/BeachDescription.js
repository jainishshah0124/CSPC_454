import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BeachDescription = ({ beachName }) => {
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchDescription = async () => {
      if(beachName){
        try {
          const response = await axios.get(
            `https://en.wikipedia.org/w/api.php`, {
            params: {
              action: 'query',
              prop: 'extracts',
              exintro: true,
              titles: `${beachName}`,
              format: 'json',
              origin: '*',
            },
          });

          const page = Object.values(response.data.query.pages)[0];
          if (page && page.extract) {
            setDescription(page.extract);
          }
        } catch (error) {
          console.error('Error fetching description:', error);
        }
      }
    };

    fetchDescription();
  }, [beachName]);

  return (
    <div>
      {description ? (
        <div dangerouslySetInnerHTML={{ __html: description }} style={{"textAlign":"justify"}} />
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default BeachDescription;