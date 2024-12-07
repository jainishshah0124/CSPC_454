import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const NearbyPlaceCard = ({ title }) => {
  const [placeData, setPlaceData] = useState(null);

  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        const response = await axios.get(
          `https://en.wikipedia.org/w/api.php`, {
          params: {
            action: 'query',
            titles: title,
            prop: 'pageimages|extracts',
            exintro: true,
            explaintext: true,
            piprop: 'thumbnail',
            pithumbsize: 300,
            format: 'json',
            origin: '*',
          },
        });

        const page = Object.values(response.data.query.pages)[0];
        if (page) {
          setPlaceData({
            title: page.title,
            image: page.thumbnail?.source || '',
            description: page.extract,
            pageId: page.pageid,
          });
        }
      } catch (error) {
        console.error('Error fetching place data:', error);
      }
    };

    fetchPlaceData();
  }, [title]);

  const truncateDescription = (text) => {
    return text.length > 200 ? `${text.substring(0, 200)}...` : text;
  };

  return (
    placeData && (
      <div className="p-4 m-2 bg-white shadow-lg rounded-lg">
        {placeData.image && (
          <img src={placeData.image} alt={placeData.title} className="w-full h-40 object-cover rounded-lg mb-4" />
        )}
        <h3 className="text-xl font-semibold mb-2">{placeData.title}</h3>
        <p className="text-sm mb-4">{truncateDescription(placeData.description)}</p>
        <a
          href={`https://en.wikipedia.org/?curid=${placeData.pageId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Read More
        </a>
      </div>
    )
  );
};

const NearbyPlacesCarousel = ({ places=[] }) => {
  console.log('Places:', places); 
  return (
    <Carousel
      swipeable={true}
      draggable={true}
      showDots={true}
      responsive={{
        superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 1 },
        desktop: { breakpoint: { max: 1024, min: 768 }, items: 2 },
        tablet: { breakpoint: { max: 768, min: 464 }, items: 1 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
      }}
      infinite={true}
      autoPlay={true}
      autoPlaySpeed={2000}
      keyBoardControl={true}
      transitionDuration={500}
    >
      {places.map((place, index) => (
        <NearbyPlaceCard key={index} title={place.title} />
      ))}
    </Carousel>
  );
};

export default NearbyPlacesCarousel;