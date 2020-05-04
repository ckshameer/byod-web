import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import MenuItemWidget from '../menuItemWidget/MenuItemWidget'
import { deepCopyFunction } from '../../helpers/utils'

interface GroupedItemSelectorProps {
  groupedItem: any
  onGroupedItemAdd: any
  onClose: any
}
interface GroupedItemSelectorState {
  groupedItem: any
  updatingGroupedItem: any
  selectedGroupedItems: any
  showAddButton: boolean
}

class GroupedItemSelector extends Component<GroupedItemSelectorProps, GroupedItemSelectorState>{
  constructor(props: GroupedItemSelectorProps) {
    super(props)
    this.state = {
      groupedItem: {},
      updatingGroupedItem: {},
      selectedGroupedItems: [],
      showAddButton: false
    }
  }

  static getDerivedStateFromProps(props: GroupedItemSelectorProps, state: GroupedItemSelectorState) {
    if (props.groupedItem !== state.groupedItem) {
      return { groupedItem: props.groupedItem, updatingGroupedItem: props.groupedItem }
    }
    return null
  }

  componentDidMount() {
    let groupedItem = this.state.groupedItem.items.map((item: any) => {
      delete item.selectedGroup
      // item.count = 0
      return item
    })
    this.setState({ groupedItem })
  }


  onClose() {
    this.setState({ groupedItem: this.props.groupedItem })
    this.props.onClose()
  }

  async onAddItemClick(item: any, operation: any) {
    this.setState({ showAddButton: true })

    let groupedItems = this.state.groupedItem.items.map((groupedItem: any) => {
      if (groupedItem.item_id === item.item_id) {
        groupedItem.selectedGroup = true
        groupedItem.count = 0
      } else {
        groupedItem.selectedGroup = false
      }
      return groupedItem
    })

    this.setState({ groupedItem: groupedItems })
  }

  addGroupedItemToCart() {
    this.props.onGroupedItemAdd(this.state.groupedItem)
  }

  onGroupedItemClick(item: any) {
    console.log('grouped item', item)
  }


  render() {
    const { groupedItem } = this.state
    return (
      <div className='selector-modal groupedItemSelector'>
        <div className='modal-header'>
          <div className="close-icon" onClick={() => this.onClose()}>
            <FontAwesomeIcon icon={faTimes} size='lg' />
          </div>
          <p>Please choose an option for</p>
          <h1 className='item-name'>{groupedItem.subcategory_name}</h1>
        </div>
        <div className='groupedItems-container'>
          {
            groupedItem.items.length &&
            groupedItem.items.map((item: any) => {
              return (
                <MenuItemWidget groupedItem key={item.item_id} onGroupedItemClick={(item: any) => this.onGroupedItemClick(item)} itemDetails={item} onAddItemClick={(item: any, operation: any) => this.onAddItemClick(item, operation)} />
              )
            })
          }
        </div>
        {
          this.state.showAddButton &&
          <div className='add-to-cart' onClick={() => this.addGroupedItemToCart()}>Add to Cart</div>
        }
      </div>
    )
  }
}
export default GroupedItemSelector
