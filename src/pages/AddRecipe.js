// src/pages/AddRecipe.js
import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function AddRecipe() {
  const [form, setForm] = useState({
    idMeal: Date.now().toString(), // simple unique id
    strMeal: '',
    strCategory: '',
    strArea: '',
    strInstructions: '',
    strMealThumb: '',
    // We'll store up to 10 ingredients and measures for simplicity
    strIngredient1: '',
    strMeasure1: '',
    strIngredient2: '',
    strMeasure2: '',
    // ... add more if you want
  });

  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Load existing custom recipes from localStorage
    const customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || [];
    // Add new recipe
    customRecipes.push(form);
    // Save back to localStorage
    localStorage.setItem('customRecipes', JSON.stringify(customRecipes));
    setSuccess(true);
    // Optional: navigate back to home after short delay
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <Container className="my-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">Add Your Recipe</h2>
      {success && <Alert variant="success">Recipe added! Redirecting...</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="strMeal">
          <Form.Label>Recipe Name</Form.Label>
          <Form.Control
            type="text"
            name="strMeal"
            value={form.strMeal}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="strCategory">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            name="strCategory"
            value={form.strCategory}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="strArea">
          <Form.Label>Area / Cuisine</Form.Label>
          <Form.Control
            type="text"
            name="strArea"
            value={form.strArea}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="strMealThumb">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="url"
            name="strMealThumb"
            value={form.strMealThumb}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="strInstructions">
          <Form.Label>Instructions</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="strInstructions"
            value={form.strInstructions}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Ingredients 1 & 2 for demo */}
        <Form.Group className="mb-3" controlId="strIngredient1">
          <Form.Label>Ingredient 1</Form.Label>
          <Form.Control
            type="text"
            name="strIngredient1"
            value={form.strIngredient1}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="strMeasure1">
          <Form.Label>Measure 1</Form.Label>
          <Form.Control
            type="text"
            name="strMeasure1"
            value={form.strMeasure1}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="strIngredient2">
          <Form.Label>Ingredient 2</Form.Label>
          <Form.Control
            type="text"
            name="strIngredient2"
            value={form.strIngredient2}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="strMeasure2">
          <Form.Label>Measure 2</Form.Label>
          <Form.Control
            type="text"
            name="strMeasure2"
            value={form.strMeasure2}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Add Recipe
        </Button>
      </Form>
    </Container>
  );
}
