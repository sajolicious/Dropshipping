import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from './Rating'
import style from '../UI/product.module.scss';
const Product = ({ product }) => {
  return (
    <Card className={`${style.customCard} my-3 p-2`}>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" className={style.customCardImage} />
      </Link>
      <Card.Body className={style.customCardBody}>
        
        <Link to={`/product/${product._id}`} className={`${style.textDark} ${style.customCardTitleLink}`}>
          <Card.Title as="div"   className={style.customCardTitle}>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div" className={style.customCardRating}>
          <Rating
            value={product.rating}
            text={` ${product.numReviews }  reviews`}
          />
        </Card.Text>
        <Card.Text as="h3" className={style.customCardPrice}>TK {product.price}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
