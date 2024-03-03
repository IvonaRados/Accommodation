import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DateCalendar from "./components/DateCalendar";
import { format } from 'date-fns';

const API_URL = 'https://api.adriatic.hr/test/accommodation'


const Homepage = () => {
    const [accommodation, setAccommodation] = useState([]);
    const [showDetails, setShowDetails] = useState({}); 
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [numberOfPeople, setNumberOfPeople] = useState(null);
    const [selectedAmenities, setSelectedAmenities] = useState([]);

    const numbers = Array.from({ length: 10 }, (_, index) => index + 1);
    const amenities = ['Air Conditioning', 'Parking Space', 'Pets', 'Pool', 'Wi-Fi', 'TV'];


    function getAccommodation() {
        const response = fetch( API_URL, 
                ).then((value) => value.json().then((accommodation) => { setAccommodation(accommodation) }))
    }

    useEffect(() => {
        getAccommodation();
    }, []);


    const toggleDetails = (accommodationId) => {
        setShowDetails((prevDetails) => ({
        ...prevDetails,
        [accommodationId]: !prevDetails[accommodationId],
        }));
    };

    const handleSelectChange = (event) => {
        setNumberOfPeople(parseInt(event.target.value, 10));
    };


    const handleAmenityChange = (amenity) => {
        if (selectedAmenities.includes(amenity)) {
        setSelectedAmenities(selectedAmenities.filter((item) => item !== amenity));
        } else {
        setSelectedAmenities([...selectedAmenities, amenity]);
        }
    };

    const checkAmenities= (accommodationAmeneties) => {
        for(const selectedAmenity of selectedAmenities) {
            if(!accommodationAmeneties[convertWord(selectedAmenity)]){
                return false;
            }
        }
        return true;
    }

    const convertWord = (word) => {
        const words = word.split(' ');
        const firstWord = words[0].toLowerCase();

        if(word==="Wi-Fi"){
            return "wifi";
        }
        return [firstWord, ...words.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1))].join('');
    }


    const isDateAvailable = (selectedStartDate, selectedEndDate, avaliableDates) => {
        const startDate = new Date(selectedStartDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(selectedEndDate);
        endDate.setHours(0, 0, 0, 0);

        for (const avaliableDate of avaliableDates){
            const intervalStart = new Date(avaliableDate.intervalStart);
            const intervalEnd = new Date(avaliableDate.intervalEnd);
            intervalStart.setHours(0, 0, 0, 0);
            intervalEnd.setHours(0, 0, 0, 0);

            if (startDate >= intervalStart && endDate <= intervalEnd){
                return true;
            }
        }
        return false;
      
      };


      const calculateTotalPrice = (startDate, endDate, availableDates) => {
        const selectedStartDate = new Date(startDate);
        selectedStartDate.setHours(0, 0, 0, 0);

        const selectedEndDate = new Date(endDate);
        selectedEndDate.setHours(0, 0, 0, 0);

        let totalPrice = 0;
      
        for (const availableDate of availableDates) {
          const intervalStart = new Date(availableDate.intervalStart);
          intervalStart.setHours(0, 0, 0, 0);

          const intervalEnd = new Date(availableDate.intervalEnd);
          intervalEnd.setHours(0, 0, 0, 0);

          if (selectedStartDate < intervalEnd && selectedEndDate > intervalStart) {
            const nightsWithinInterval = Math.min(selectedEndDate, intervalEnd) - Math.max(selectedStartDate, intervalStart);
            const nights = nightsWithinInterval / (24 * 60 * 60 * 1000); 
      
            totalPrice += nights * availableDate.pricePerNight;
          }
        }
      
        return Math.round(totalPrice);
      };

      const calculateMinMaxPrice = (pricelistInEuros) => {
        let arrayPrices = []

        for (const interval of pricelistInEuros) {
            arrayPrices.push(interval.pricePerNight);
        }
        return "Min: " + Math.min(...arrayPrices) + ". Max: " +  Math.max(...arrayPrices);
      }


    return (
        <div>
            <div>
                <DateCalendar startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate}/>
                <p>
                {startDate && endDate
                    ? `Selected dates: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`
                    : 'Please select start and end dates'}
                </p>
            </div>
            <div>
                <label htmlFor="numberSelect">Select the number of guests:</label>
                <select id="numberSelect" onChange={handleSelectChange} value={numberOfPeople || ''}>
                {numbers.map((number) => (
                    <option key={number} value={number}>
                    {number}
                    </option>
                ))}
                </select>
            </div>
                    {numberOfPeople !== null && (
                        <p>You selected: {numberOfPeople}</p>
                    )}
            <div>

            <h2>Amenity Search</h2>
            <div>
                {amenities.map((amenity) => (
                <div key={amenity}>
                    <label>
                    <input
                        type="checkbox"
                        value={amenity}
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                    />
                    {amenity}
                    </label>
                </div>
                ))}
            </div>

            <div>
                <h3>Selected Amenities:</h3>
                <ul>
                {selectedAmenities.map((selectedAmenity) => (
                    <li key={selectedAmenity}>{selectedAmenity}</li>
                ))}
                </ul>
            </div>
                {accommodation.map((item) => (
                    <div>
                    <div>
                    {(startDate && endDate) ? (
                        <div>
                            
                            {isDateAvailable(startDate, endDate, item.availableDates) && item.capacity>=numberOfPeople && checkAmenities(item.amenities) && (
                                <div>
                                    The date is available here!

                                    <div>
                                        <div key={item.id}>
                                        <h2>{item.title}</h2>
                                        <img src={item.image} alt="My Image" />
                                        <br></br>
                                        Capacity: {item.capacity}
                                        <br></br>
                                        {item.beachDistanceInMeters && (
                                            <div>
                                                Distance from the beach: {item.beachDistanceInMeters}
                                            </div>
                                        )}
                                        <br></br>
                                        {showDetails[item.id] ? (
                                            <div>
                                                <div>
                                                    {Object.entries(item.amenities).map(([amenity, hasAmenity]) => (
                                                        <div key={amenity}>
                                                            {hasAmenity ? (
                                                                <div >
                                                                    <h4>{amenity}</h4>
                                                                </div>
                                                            ) : null

                                                            }
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                            </div>
                                            ) : null}
                                            <button onClick={() => toggleDetails(item.id)}>
                                            {showDetails[item.id] ? "Show Less" : "Show More"}
                                            </button>

                                    </div>
                                    </div>
                                    Total price: {calculateTotalPrice(startDate, endDate, item.pricelistInEuros)}
                                    <Link to={`/rezervirano`} state={{ startDate: format(startDate, 'yyyy-MM-dd'), endDate: format(endDate, 'yyyy-MM-dd'), title: item.title,
                                                                                capacity: numberOfPeople, totalPrice: calculateTotalPrice(startDate, endDate, item.pricelistInEuros) }}>
                                        <button type="button">Rezerviraj</button>
                                        <hr />
                                    </Link>
                                    <hr />

                                </div>
                            )}
                               
                        </div>
                        ) : (
                            <div>
                                <div key={item.id}>
                                <h2>{item.title}</h2>
                                <img src={item.image} alt="My Image" />
                                <br></br>
                                Capacity: {item.capacity}
                                <br></br>
                                {item.beachDistanceInMeters && (
                                    <div>
                                        Distance from the beach: {item.beachDistanceInMeters}
                                    </div>
                                )}
                                <br></br>
                                {showDetails[item.id] ? (
                                    <div>
                                        <div>
                                            {Object.entries(item.amenities).map(([amenity, hasAmenity]) => (
                                                <div key={amenity}>
                                                    {hasAmenity ? (
                                                        <div >
                                                            <h4>{amenity}</h4>
                                                        </div>
                                                    ) : null

                                                    }
                                                </div>
                                            ))}
                                        </div>
                                        
                                    </div>
                                    ) : null}
                                    <button onClick={() => toggleDetails(item.id)}>
                                    {showDetails[item.id] ? "Show Less" : "Show More"}
                                    </button>

                            </div>
                                {calculateMinMaxPrice(item.pricelistInEuros)}. 
                                <hr />

                            </div>


                        )

                    }
                </div>

                    
                    </div>

                ))}
            </div>
        </div>
    )

}

export default Homepage;