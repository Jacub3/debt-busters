import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import '../Interfaces/QuestionareData';
import type { QuestionnaireData } from '../Interfaces/QuestionareData';

const Questionnaire: React.FC = () => {
  // Statically typed state variable
  const [formData, setFormData] = useState<QuestionnaireData>({
    favoriteColor: '',
    age: '',
    season: '',
    hobbies: [],
  });

  // Statically typed handler for text, number, and radio inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  // Statically typed handler for checkboxes (hobbies)
  const handleHobbyChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value, checked } = e.target;
    
    setFormData((prev) => {
      const updatedHobbies = checked
        ? [...prev.hobbies, value]
        : prev.hobbies.filter((hobby) => hobby !== value);
      
      return { ...prev, hobbies: updatedHobbies };
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Collected Data:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 1. Text Input */}
      <p>1. What is your favorite color?</p>
      <input 
        type="text" 
        name="favoriteColor" 
        value={formData.favoriteColor} 
        onChange={handleChange} 
      />

      {/* 2. Number Input */}
      <p>2. What is your age?</p>
      <input 
        type="number" 
        name="age" 
        value={formData.age} 
        onChange={handleChange} 
      />

      {/* 3. Radio Inputs */}
      <p>3. What is your favorite season?</p>
      {['spring', 'summer', 'fall', 'winter'].map((option) => (
        <label key={option}>
          <input 
            type="radio" 
            name="season" 
            value={option} 
            checked={formData.season === option} 
            onChange={handleChange} 
          /> {option}
        </label>
      ))}

      {/* 4. Checkbox Inputs */}
      <p>4. What hobbies do you enjoy?</p>
      {['reading', 'sports', 'music'].map((hobby) => (
        <label key={hobby}>
          <input 
            type="checkbox" 
            value={hobby} 
            checked={formData.hobbies.includes(hobby)} 
            onChange={handleHobbyChange} 
          /> {hobby}
        </label>
      ))}

      <button type="submit">Submit</button>
    </form>
  );
};
export default Questionnaire;