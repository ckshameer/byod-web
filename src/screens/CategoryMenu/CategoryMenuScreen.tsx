import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { categorySelectOperations } from '../../state/features/category'
import { Link } from 'react-router-dom'
interface CategoryMenuProps {
  onClose: any;
  updateSelectedCategory: any
}
interface CategoryMenuState {
  categories: any
}

class CategoryMenuScreen extends Component<CategoryMenuProps, CategoryMenuState> {
  constructor(props: any) {
    super(props)
    this.state = {
      categories: []
    }
  }
  static getDerivedStateFromProps(nextProps: any, nextState: any) {
    if (nextProps.categories !== nextState.categories) {
      return { categories: nextProps.categories }
    }
    return null
  }
  componentDidMount() {
    console.log(this.props)
  }

  onCloseClick() {
    this.props.onClose()
  }
  onCategoryClick(categoryId: any) {
    console.log(categoryId)
    this.props.updateSelectedCategory(categoryId)
    this.props.onClose()
  }
  render() {
    return (
      <div className='selector-modal categoryMenu'>
        <div className='category-list'>
          {
            this.state.categories.length &&
            this.state.categories.map((category: any) => {
              return (
                <div className='category-item' onClick={() => this.onCategoryClick(category.category_id)} key={category.category_id}>{category.category_name}</div>
              )
            })
          }
        </div>
        <Link to={{ pathname: '/menu', state: '' }} className='close-button' onClick={() => this.onCloseClick()}>
          <FontAwesomeIcon color={'#fff'} size='2x' icon={faTimesCircle} />
        </Link>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  let categories = state.restaurantDetails.restaurantDetails.menu.categories
  return { categories }
}
const mapDispatchToProps = {
  updateSelectedCategory: categorySelectOperations.updateSelectedCategory
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryMenuScreen)
