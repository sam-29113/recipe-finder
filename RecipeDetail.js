// src/pages/RecipeDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Image, ListGroup, Form, Button, ButtonGroup } from 'react-bootstrap';
import axios from 'axios';

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  // Rating & Reviews state
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then(res => setRecipe(res.data.meals[0]))
      .catch(err => console.error(err));

    const savedReviews = JSON.parse(localStorage.getItem(`reviews_${id}`)) || [];
    setReviews(savedReviews);
  }, [id]);

  const submitReview = () => {
    if (rating === 0) return alert('Please provide a rating');
    const newReview = { rating, review, date: new Date().toISOString() };
    const updatedReviews = [...reviews, newReview];
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
    setReviews(updatedReviews);
    setRating(0);
    setReview('');
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  // Share buttons helpers
  const url = `${window.location.origin}/recipe/${id}`;
  const text = encodeURIComponent(`Check out this recipe: ${recipe?.strMeal}`);

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  if (!recipe) return <p>Loading...</p>;

  return (
    <Container className="my-4">
      <h2>{recipe.strMeal}</h2>
      <Image
        src={recipe.strMealThumb}
        fluid
        style={{ maxWidth: '400px', margin: 'auto', display: 'block' }}
        className="mb-4"
      />
      <div className="d-flex justify-content-center gap-4 mb-3">
        <h5 className="fw-bold">{recipe.strCategory}</h5>
        <h5 className="fw-bold">{recipe.strArea}</h5>
      </div>
      {averageRating && (
        <p>
          <strong>Average Rating:</strong> {averageRating} ⭐ ({reviews.length} review{reviews.length > 1 ? 's' : ''})
        </p>
      )}

      {/* Share Buttons */}
      <ButtonGroup className="mb-3">
        <Button
          variant="primary"
          onClick={() =>
            window.open(
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
              '_blank'
            )
          }
        >
          Facebook
        </Button>
        <Button
          variant="info"
          onClick={() =>
            window.open(
              `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`,
              '_blank'
            )
          }
        >
          Twitter
        </Button>
        <Button variant="success" onClick={copyLink}>
          Copy Link
        </Button>
      </ButtonGroup>

      <h4>Instructions</h4>
      <p>{recipe.strInstructions}</p>

      <h4>Ingredients</h4>
      <ListGroup>
        {Array.from({ length: 20 }, (_, i) => {
          const index = i + 1;
          const ingredient = recipe[`strIngredient${index}`];
          const measure = recipe[`strMeasure${index}`];
          return ingredient && ingredient.trim() !== '' ? (
            <ListGroup.Item key={index}>{`${ingredient} - ${measure}`}</ListGroup.Item>
          ) : null;
        })}
      </ListGroup>

      <hr />
      <h4>Leave a Review</h4>
      <Form.Group className="mb-3">
        <Form.Label>Rating:</Form.Label>
        <div>
          {[1, 2, 3, 4, 5].map(star => (
            <span
              key={star}
              style={{ cursor: 'pointer', fontSize: '1.5rem', color: star <= rating ? '#ffc107' : '#e4e5e9' }}
              onClick={() => setRating(star)}
              aria-label={`${star} star`}
            >
              ★
            </span>
          ))}
        </div>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Review:</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={review}
          onChange={e => setReview(e.target.value)}
          placeholder="Write your review here..."
        />
      </Form.Group>
      <Button onClick={submitReview} variant="primary" disabled={!review.trim()}>
        Submit Review
      </Button>

      <hr />
      <h4>Reviews</h4>
      {reviews.length === 0 && <p>No reviews yet.</p>}
      {reviews.map((r, i) => (
        <div key={i} style={{ marginBottom: '1rem' }}>
          <div style={{ color: '#ffc107' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
          <p>{r.review}</p>
          <small className="text-muted">{new Date(r.date).toLocaleString()}</small>
        </div>
      ))}
    </Container>
  );
}
