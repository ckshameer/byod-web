import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import MenuItemWidget from '../menuItemWidget/MenuItemWidget'

interface OrderRepeatConfirmProps {
  item: any
  onHandleRepeatOrder: any
  onClose: any
}
interface OrderRepeatConfirmState { }

class OrderRepeatConfirm extends Component<OrderRepeatConfirmProps, OrderRepeatConfirmState>{

  componentDidMount() {
    console.log(this.props)
  }


  onCloseClick() {
    this.props.onClose()
  }
  onDismiss(e: any) {
    e.stopPropagation()
    this.props.onClose()
  }
  onBodyClick(e: any) {
    e.stopPropagation()
  }

  onActionClick(e: any, answer: any) {
    e.stopPropagation()
    this.props.onHandleRepeatOrder(answer, this.props.item)
  }

  render() {
    return (
      <div className='selector-modal' onClick={(e: any) => this.onDismiss(e)}>
        <div className=' orderConfirm' onClick={(e: any) => this.onBodyClick(e)}>
          <div className='orderConfirm-header'>
            <div className='item-name'>{this.props.item.item_name ? this.props.item.item_name :this.props.item.subcategory_name}</div>
            <div className='close-icon' onClick={() => this.onCloseClick()}>
              <FontAwesomeIcon size={'1x'} icon={faTimes}></FontAwesomeIcon>
            </div>
          </div>
          <div className='order-item'>
            <p>Previous Order</p>
            {
              this.props.item.items ?
                this.props.item.items.map((groupedItem: any) => {
                  if (groupedItem.selectedGroup) {
                    return (
                      <MenuItemWidget key={groupedItem.item_id} isRepeat itemDetails={groupedItem} />
                    )
                  } else {
                    return null
                  }
                })
                :
                <MenuItemWidget key={this.props.item.item_id} isRepeat itemDetails={this.props.item} />
            }
          </div>
          <div className='modal-actions'>
            <button className='button' onClick={(e: any) => this.onActionClick(e, false)}>Add New</button>
            <button className='button button-primary ' onClick={(e: any) => this.onActionClick(e, true)}>Repeat Last</button>
          </div>
        </div>
      </div>
    )
  }
}

export default OrderRepeatConfirm
