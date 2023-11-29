import React, { useState, useEffect } from 'react';
import './OutputScreen.css';
import './SubmissionForm.css';
import axios from 'axios';
// import ShowImage from './ShowImage';

const OutputScreen = () => {
  const [data, setData] = useState([]);
  const [paintingId, setPaintingId] = useState('');
  const [paintingData, setPaintingData] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [imageData, setImageData] = useState('');
 
  useEffect(() => {
    fetchData();
  }, []);

const fetchPaintingData = async (id) => {
  try {
    const response = await axios.get(`http://localhost:5000/search/${paintingId}`);
    setPaintingData(response.data);
    setSearchError('');
  } catch (error) {
    console.error('Error fetching painting data:', error);
    setSearchError('Painting not found');
    setPaintingData(null);
  }
};

// const handleSearch = async () => {
//   try {
//     const response = await axios.get(`http://localhost:5000/search/${paintingId}`);
//     setPaintingData(response.data);
//     setSearchError('');
//   } catch (error) {
//     console.error('Error fetching search results:', error);
//     setSearchError('Painting not found');
//     setPaintingData(null);
//   }
//};

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/get');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const fetchImage = async (id) => {
  //   try {
  //     const response = await axios.get(`http://localhost:5000/get_image/${paintingId}`);
  //     setImageURL(URL.createObjectURL(new Blob([response.data])));
  //   } catch (error) {
  //     console.error('Error fetching image:', error);
  //     setImageURL('');
  //   }
  // };
  const fetchImage = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/get_image/${id}`, {
        responseType: 'arraybuffer',
      });
      const base64 = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );
      setImageData(`data:image/jpeg;base64,${base64}`);
    } catch (error) {
      console.error('Error fetching image:', error);
      setImageData('');
    }
  };

  const handleSearch = () => {
    fetchPaintingData(paintingId);
    fetchImage(paintingId);
  };


  return (
    <div className="container">
      <div className="headerContainer">
        <div className="titleHeader">Wallace Collection, London </div>
      </div>

      <div className="body">
        <div className="searchBar">
          <input
            type="text"
            placeholder="Search..."
            value={paintingId}
            onChange={(e) => setPaintingId(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        {/* <h1>Data from Flask API</h1> */}
        {/* <ul>
          {data.map((item, index) => (
            <div className="painting-info" key={index}>
              <h2>Name: {item.paintingName}</h2>
              <p>Year: {item.description}</p>
            </div>
          ))}
        </ul> */}

        {paintingData && (
          <div className="search-results">
            <h2>Search Results:</h2>
            <div className="painting-info">
              {/* <h2>Name: {paintingData.paintingName}</h2> */}
              <h3>{paintingData.paintingName}</h3>
              <p className="element">#{paintingData.paintingId}</p>
              <p className="element">{paintingData.painter}</p>
              <p className="element">{paintingData.year}</p>
              <p className="element">{paintingData.style}</p>
              <p className="element">{paintingData.medium}</p>
              <p className="element">{paintingData.dimensions}</p>
              <p className="element">{paintingData.description}</p>
              {/* Add other fields here */}
            </div>
            {imageData && <img src={imageData} alt={paintingData.paintingName} />}
            {/* <ShowImage imageUrl={selectedImageUrl}/> */}

          </div>
        )}

        {searchError && <p className="error-message">{searchError}</p>}
      </div>
    </div>
  );
};

export default OutputScreen;
