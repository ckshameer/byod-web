import React, { Component } from 'react'
import ModifierSelector from '../modifierSelector/ModifierSelector'
import GroupedItemSelector from '../groupedItemSelector/GroupedItemSelector'
import OrderRepeatConfirm from '../orderRepeatConfirm/OrderRepeatConfirm'

interface MenuItemWidgetProps {
  itemDetails: any
  onAddItemClick?: any
  modifierItem?: boolean
  modifierType?: any
  onModifierItemClick?: any
  onCart?: boolean
  groupedItem?: boolean
  onGroupedItemClick?: any
  isRepeat?: boolean
}
interface MenuItemWidgetState {
  menuItem: any,
  cartItems: any;
  openModifierSelector: boolean
  itemType: any
  openGroupedItemSelector: boolean
  editModifier: boolean
  openOrderConfirm: boolean
}

class MenuItemWidget extends Component<MenuItemWidgetProps, MenuItemWidgetState>{
  constructor(props: MenuItemWidgetProps) {
    super(props)
    this.state = {
      menuItem: {},
      editModifier: false,
      openOrderConfirm: false,
      cartItems: [],
      itemType: undefined,
      openModifierSelector: false,
      openGroupedItemSelector: false
    }
  }

  static getDerivedStateFromProps(props: any, state: any) {
    if (state.menuItem !== props.menuItem) {
      return { menuItem: props.itemDetails }
    }
    return null
  }

  onAddItemClick(e: any, item: any) {
    // e.stopPropagation()
    let newItem = item
    if (newItem.items) {
      this.setState({ openGroupedItemSelector: true })
    } else if (newItem.groups.length) {
      let optional = true
      item.groups.map((group: any) => {
        if (group.group_minimum > 0) {
          optional = false
        }
        return null
      })
      item.optional = optional
      if (!optional) {
        this.setState({ openModifierSelector: true })
      } else {
        if (!this.props.groupedItem) {
          item.count = item.count + 1
        }
        this.addToCart(item)
        this.setState({ menuItem: item })
        // this.addToCart(this.state.menuItem)
        // if (!this.props.groupedItem) {
        // }
      }
    } else {
      if (!this.props.groupedItem) {
        item.count = item.count + 1
      }
      this.setState({ menuItem: item })
      this.addToCart(this.state.menuItem)
      // if (!this.props.groupedItem) {
      // }
    }
  }

  onCountControlClick(e: any, operation: string, item: any) {
    console.log('Click delete')
    e.stopPropagation()
    if (operation === 'add') {
      if (item.subcategory_id) {
        if (this.props.onCart) {
          item.count = item.count + 1
          this.setState({ menuItem: item }, () => this.props.onAddItemClick(this.state.menuItem, 'countAdd'))
        } else {
          this.setState({ openOrderConfirm: true })
        }
      } else if (item.groups.length) {
        if (this.props.onCart) {
          item.count = item.count + 1
          this.setState({ menuItem: item }, () => this.props.onAddItemClick(this.state.menuItem, 'countAdd'))
        } else {
          this.setState({ openOrderConfirm: true })
        }
      } else {
        item.count = item.count + 1
        if (this.props.modifierItem) {
          this.props.onModifierItemClick(item)
          console.log('called')
        } else {
          this.setState({ menuItem: item })
          this.props.onAddItemClick(this.state.menuItem, 'countAdd')
        }
      }
    } else if (operation === 'delete') {
      console.log('item', item)
      item.count = item.count - 1
      if (this.props.modifierItem) {
        this.props.onModifierItemClick(item)
      } else {
        if (item.items) {
          console.log(item.items)
          let itemToBeDeleted = item.items.find((item: any) => item.selectedGroup)
          itemToBeDeleted.count = itemToBeDeleted.count - 1
          this.setState({ menuItem: item })
          this.props.onAddItemClick(itemToBeDeleted, 'countDelete')
        } else {
          this.setState({ menuItem: item })
          this.props.onAddItemClick(this.state.menuItem, 'countDelete')
        }
      }
    }
  }

  addToCart(item: any) {
    this.props.onAddItemClick(item, 'simpleAdd')
  }

  onItemClick(e: any, item: any) {
    e.stopPropagation()
    if (this.props.modifierItem) {
      this.props.onModifierItemClick(item)
    }
    if (this.props.groupedItem) {
      this.props.onGroupedItemClick(item)
    }
  }

  addModifierToItem(item: any) {
    console.log('modifier item', item)
    this.setState({ openModifierSelector: false })
    item.count = item.count + 1
    this.setState({ menuItem: item })
    console.log(this.state.menuItem);
    this.props.onAddItemClick(item, 'simpleAdd')
  }
  closeModifierSelector() {
    this.setState({ openModifierSelector: false })
  }
  onEditClick() {
    this.setState({ editModifier: true })
    this.setState({ openModifierSelector: true })
  }

  updateModifier(item: any) {
    this.setState({ menuItem: item })
    this.props.onAddItemClick(item, 'update')
    this.setState({ openModifierSelector: false })
  }

  async onGroupedItemAdd(item: any) {
    item.count = item.count + 1
    console.log('item', item)
    item.items.map((selectedItem: any) => {
      if (selectedItem.selectedGroup) {
        selectedItem.count = selectedItem.count + 1
        this.props.onAddItemClick(selectedItem, 'simpleAdd')
      }
      return null
    })
    this.setState({ openGroupedItemSelector: false })
  }


  closeGroupedItemSelector() {
    this.setState({ openGroupedItemSelector: false })
  }


  onHandleRepeatOrder(answer: any, item: any, e: any) {
    console.log(item, answer)
    if (answer) {
      item.count = item.count + 1
      if (this.props.modifierItem) {
        console.log('yes')
        this.props.onModifierItemClick(item)
      } else if (item.items) {
        let itemToBeAdded = item.items.find((item: any) => item.selectedGroup)
        itemToBeAdded.count = itemToBeAdded.count + 1
        this.props.onAddItemClick(itemToBeAdded, 'countAdd')
      } else {
        this.setState({ menuItem: item })
        this.props.onAddItemClick(this.state.menuItem, 'countAdd')
      }
    } else {
      console.log('add new', item)
      let new_id = Math.round((item.item_id * 10) + Math.random())
      // item.count = 0
      item.item_id = new_id
      if (item.items) {
      } else {
      }
      this.onAddItemClick(e, item)
    }
    this.setState({ openOrderConfirm: false })
  }


  render() {

    const modifierType = this.props.modifierType
    let button
    if (modifierType === 'single_item') {
      button = <button className={this.state.menuItem.selected ? 'radio-button selected' : 'radio-button'} onClick={(e) => this.onItemClick(e, this.state.menuItem)}></button>
    } else if (modifierType === 'multiple_item') {
      button = <button disabled={this.state.menuItem.disable ? true : false} className={this.state.menuItem.selected ? 'check-box selected' : 'check-box'} onClick={(e) => this.onItemClick(e, this.state.menuItem)} />
    } else {
      button = (
        <div className='addCount'>
          <div className='count-container'>{this.state.menuItem.count}</div>
          <div className='count-controller'>
            <button className='count-button' disabled={this.state.menuItem.count === 0 ? true : false} onClick={(e) => this.onCountControlClick(e, 'delete', this.state.menuItem)}>-</button>
            <button className='count-button' disabled={this.state.menuItem.disable ? true : false} onClick={(e) => this.onCountControlClick(e, 'add', this.state.menuItem)}>+</button>
          </div>
        </div>
      )
    }

    let modfiers = (menuItem: any) => (
      menuItem.groups.map((group: any) => {
        let groups = group.items.map((item: any) => {
          let selected_item;
          if (item.selected === true) {
            selected_item = item
          }
          return (
            selected_item &&
            <div className='modifier-item' key={selected_item.item_id}>{selected_item.item_name}</div>
          )
        })
        return groups
      })
    )

    return (
      <div
        className={(this.props.groupedItem && (this.state.menuItem.selectedGroup === true)) ? 'menuItem-widget selected' : 'menuItem-widget'}
        style={(this.props.groupedItem && (this.state.menuItem.selectedGroup === false)) ? { opacity: '0.5' } : {}}
        onClick={this.props.groupedItem ? (e: any) => this.onAddItemClick(e, this.state.menuItem) : (e) => this.onItemClick(e, this.state.menuItem)}>
        {
          this.state.openModifierSelector &&
          <ModifierSelector isEdit={this.state.editModifier} onClose={() => this.closeModifierSelector()} onModifierUpdate={(item: any) => this.updateModifier(item)} onModifierAdd={(item: any) => this.addModifierToItem(item)} modifierItem={this.state.menuItem} />
        }
        {
          this.state.openGroupedItemSelector &&
          <GroupedItemSelector onClose={() => this.closeGroupedItemSelector()} onGroupedItemAdd={(item: any) => this.onGroupedItemAdd(item)} groupedItem={this.state.menuItem} />
        }
        {
          this.props.modifierItem ?
            this.state.menuItem.item_image_url &&
            <div className='item-image'>
              {
                this.state.menuItem.item_image_url &&
                <img src={this.state.menuItem.item_image_url} alt='food' />

              }
              {/* <img src={require('../../assets/images/download.png')} alt='food' /> */}
            </div>
            :
            <div className='item-image'>
              <img src={this.state.menuItem.item_image_url ? this.state.menuItem.item_image_url : require('../../assets/images/no-preview.png')} alt='food' />
            </div>
        }
        <div className='item-details'>
          <div className='item-name'>{this.state.menuItem.item_name ? this.state.menuItem.item_name : this.state.menuItem.subcategory_name}</div>
          <div className='item-description'>{this.state.menuItem.item_short_description ? this.state.menuItem.item_short_description : this.state.menuItem.subcategory_name}</div>
          {
            (this.state.menuItem.item_unit_price > 0) &&
            <div className={this.props.modifierItem ? 'item-price modifier-price' : 'item-price'}>{'AED ' + this.state.menuItem.item_unit_price}</div>
          }
          {
            (this.props.onCart || this.props.isRepeat) &&
              this.state.menuItem.groups.length ?
              <div>
                {modfiers(this.state.menuItem)}
                {
                  !this.props.isRepeat &&
                  <div className='edit-item' onClick={() => this.onEditClick()}>Edit</div>
                }
              </div>
              : <div />
          }
        </div>
        {
          !this.props.groupedItem &&
          !this.props.isRepeat &&
          !this.props.modifierItem && (
            this.state.menuItem.count ?
              this.state.menuItem.count === 0 ?
                <div className='addToCart'>
                  <button onClick={(e) => this.onAddItemClick(e, this.state.menuItem)} className='button button-add'>ADD</button>
                </div>
                :
                <div className='addCount'>
                  <div className='count-container'>{this.state.menuItem.count}</div>
                  <div className='count-controller'>
                    <button className='count-button' onClick={(e) => this.onCountControlClick(e, 'delete', this.state.menuItem)}>-</button>
                    <button className='count-button' onClick={(e) => this.onCountControlClick(e, 'add', this.state.menuItem)}>+</button>
                  </div>
                </div>
              :
              <div className='addToCart'>
                <button onClick={(e) => this.onAddItemClick(e, this.state.menuItem)} className='button button-add'>ADD</button>
              </div>
          )
        }
        {
          (this.props.groupedItem && !this.state.menuItem.selectedGroup) &&
          <div className='addToCart'>
            <button onClick={(e) => this.onAddItemClick(e, this.state.menuItem)} className='button button-add'>ADD</button>
          </div>
        }
        {
          this.props.modifierItem &&
          <div className='addToCart'>
            {button}
          </div>
        }
        {
          this.state.openOrderConfirm &&
          <OrderRepeatConfirm onClose={() => this.setState({ openOrderConfirm: false })} onHandleRepeatOrder={(confirm: any, item: any, e: any) => this.onHandleRepeatOrder(confirm, item, e)} item={this.state.menuItem} />
        }
      </div>
    )
  }
}

export default MenuItemWidget
