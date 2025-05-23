// src/components/RecipeCard.js
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function RecipeCard({ recipe }) {
  return (
    <Card className="shadow-sm h-100">
      <Card.Img
        variant="top"
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        style={{ height: '220px', objectFit: 'cover' }}
      />
      <Card.Body>
        <Card.Title>{recipe.strMeal}</Card.Title>
        <Link to={`/recipe/${recipe.idMeal}`}>
          <Button variant="outline-dark" size="sm">View Recipe</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}
