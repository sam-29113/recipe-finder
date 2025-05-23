// src/pages/Home.js
import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Button, Row, Col, Spinner, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';

export default function Home() {
  const [query, setQuery] = useState('');
  const [ingredientQuery, setIngredientQuery] = useState('');
  const [allRecipes, setAllRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchAllMeals = async () => {
      setLoading(true);
      try {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        const requests = alphabet.split('').map(letter =>
          axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${letter}`)
        );
        const results = await Promise.all(requests);
        const meals = results.flatMap(res => res.data.meals || []);

        // Remove duplicates by ID
        const uniqueMeals = Array.from(new Map(meals.map(meal => [meal.idMeal, meal])).values());

        // Load custom recipes from localStorage
        const custom = JSON.parse(localStorage.getItem('customRecipes')) || [];

        // Merge custom recipes with API recipes
        const merged = [...custom, ...uniqueMeals];

        // Shuffle to mix
        const shuffled = merged.sort(() => 0.5 - Math.random());

        setAllRecipes(shuffled);
        setFilteredRecipes([]);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      }
      setLoading(false);
    };

    fetchAllMeals();
  }, []);

  // Filter dish name suggestions as user types
  const getSuggestions = (input) => {
    if (!input.trim()) return [];
    return allRecipes.filter(meal =>
      meal.strMeal.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 6);
  };

  const suggestions = getSuggestions(query);

  // When user clicks a suggestion
  const selectSuggestion = (name) => {
    setQuery(name);
    setShowSuggestions(false);

    const filtered = allRecipes.filter(meal =>
      meal.strMeal.toLowerCase().includes(name.toLowerCase())
    );
    setFilteredRecipes(filtered);
  };

  // Filter by ingredients string (comma separated)
  const filterByIngredients = (recipes, ingredientString) => {
    const ingredients = ingredientString.toLowerCase().split(',').map(i => i.trim()).filter(Boolean);
    if (ingredients.length === 0) return recipes;
    return recipes.filter(recipe => {
      return ingredients.every(ing =>
        Array.from({ length: 20 }).some((_, i) => {
          const ingredient = recipe[`strIngredient${i + 1}`];
          return ingredient && ingredient.toLowerCase().includes(ing);
        })
      );
    });
  };

  // Handle search submit
  const searchRecipes = (e) => {
    e.preventDefault();
    if (!query.trim() && !ingredientQuery.trim()) return;

    let filtered = allRecipes;

    if (query.trim()) {
      filtered = filtered.filter(meal =>
        meal.strMeal.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (ingredientQuery.trim()) {
      filtered = filterByIngredients(filtered, ingredientQuery);
    }

    setFilteredRecipes(filtered);
    setShowSuggestions(false);
  };

  // Close suggestions on clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4 fw-bold">🍽️ Find Delicious Recipes</h2>
      <Form onSubmit={searchRecipes} autoComplete="off">
        <div style={{ position: 'relative', width: '50%', marginBottom: '0.5rem' }} ref={inputRef}>
          <Form.Control
            type="text"
            placeholder="Search by dish name (e.g., 'chicken', 'pasta')"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ListGroup
              style={{
                position: 'absolute',
                top: '100%',
                zIndex: 1000,
                width: '100%',
                maxHeight: '200px',
                overflowY: 'auto',
                cursor: 'pointer',
              }}
            >
              {suggestions.map((s) => (
                <ListGroup.Item
                  key={s.idMeal}
                  action
                  onClick={() => selectSuggestion(s.strMeal)}
                >
                  {s.strMeal}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
        <Form.Control
          type="text"
          placeholder="Filter by ingredients (comma separated, e.g., 'tomato, cheese')"
          className="mb-3"
          value={ingredientQuery}
          onChange={e => setIngredientQuery(e.target.value)}
        />
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" /> Searching...
            </>
          ) : (
            'Search'
          )}
        </Button>
      </Form>

      <Row className="mt-4 g-4">
        {(filteredRecipes.length > 0 ? filteredRecipes : allRecipes.slice(0, 20)).map(recipe => (
          <Col md={3} sm={6} xs={12} key={recipe.idMeal}>
            <RecipeCard recipe={recipe} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
