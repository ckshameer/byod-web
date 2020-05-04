import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import MenuItemWidget from '../menuItemWidget/MenuItemWidget'

interface ModifierSelectorProps {
  modifierItem: any
  onModifierAdd: any
  onClose: any
  isEdit: boolean
  onModifierUpdate: any
  parentItem?: any
}
interface ModifierSelectorState {
  item: any
  selecteItemsCount: number
  selectedModifiers: any
  showAddCartButton: boolean
}


class ModifierSelector extends Component<ModifierSelectorProps, ModifierSelectorState>{
  constructor(props: ModifierSelectorProps) {
    super(props)
    this.state = {
      item: {},
      showAddCartButton: false,
      selecteItemsCount: 0,
      selectedModifiers: null
    }
  }
  static getDerivedStateFromProps(props: any, state: any) {
    if (state.item !== props.modifierItem) {
      return { item: props.modifierItem }
    }
    return null
  }
  componentDidMount() {
    let { item } = this.state
    if (!this.props.isEdit || item.optional) {
      let item_groups = this.updateGroupTypes(item)
      let item_types = this.updateItemTypes(item)
      item.groups = item_groups
      item.groups = item_types
      item.groups.map((group: any) => {
        group.items.map((item: any) => {
          item.selected = false
          return null
        })
        return null
      })
    }
    this.setState({ item })
  }

  updateItemTypes(item: any) {
    let item_types = item.groups.map((group: any) => {
      if (group.group_has_quantity_selector) {
        group.group_item_type = 'quantity_selector'
      } else if (group.group_maximum === 1) {
        group.group_item_type = 'single_item'
      } else {
        group.group_item_type = 'multiple_item'
      }
      return group
    })
    return item_types
  }

  updateGroupTypes(item: any) {
    let item_groups = item.groups.map((group: any) => {
      if (group.group_minimum === 0) {
        let group_type = 'optional'
        group.group_type = group_type
      }
      if (group.group_minimum > 0) {
        group.group_type = 'mandatory'
        group.selectedMinimum = false
      }
      return group
    })
    return item_groups
  }

  onModifierItemClick(modifierGroup: any, selectedModifierItem: any) {
    if (modifierGroup.group_item_type === 'multiple_item') {
      let groupItems = modifierGroup.items.map((item: any) => {
        if (item === selectedModifierItem) {
          if (item.selected) {
            item.selected = false
          } else {
            item.selected = true
          }
        }
        return item
      })


      let selectedItemsArray = groupItems.filter((item: any) => item.selected === true)

      if (modifierGroup.group_maximum > 0) {
        if (selectedItemsArray.length === modifierGroup.group_maximum) {
          groupItems.map((item: any) => {
            item.disable = true
          })
        } else {
          groupItems.map((item: any) => {
            item.disable = false
          })
        }
      }
      modifierGroup.items = groupItems
    }


    if (modifierGroup.group_item_type === 'single_item') {
      let groupItems = modifierGroup.items.map((item: any) => {
        item.selected = false
        if (item === selectedModifierItem) {
          if (item.selected) {
            item.selected = false
          } else {
            item.selected = true
          }
        }
        return item
      })
      modifierGroup.items = groupItems
    }


    if (modifierGroup.group_item_type === "quantity_selector") {
      let groupItems = modifierGroup.items.map((item: any) => {
        if (item.count > 0) {
          console.log(item)
          item.selected = true
        }
        return item
      })

      let totalItemCount = 0;
      groupItems.map((item: any) => {
        totalItemCount = totalItemCount + item.count
      })

      if (totalItemCount === modifierGroup.group_maximum) {
        groupItems.map((item: any) => {
          item.disable = true
        })
      } else {
        groupItems.map((item: any) => {
          item.disable = false
        })
      }
      modifierGroup.items = groupItems
    }


    let selectedItemsArray = modifierGroup.items.filter((item: any) => item.selected === true)

    if (selectedItemsArray.length >= modifierGroup.group_minimum) {
      modifierGroup.selectedMinimum = true
    } else {
      modifierGroup.selectedMinimum = false
    }


    let totalItemCount = 0

    if (modifierGroup.group_has_quantity_selector) {
      modifierGroup.items.map((item: any) => {
        totalItemCount = totalItemCount + item.count
      })
    }

    if (modifierGroup.group_item_type === "quantity_selector") {
      if (totalItemCount >= modifierGroup.group_minimum) {
        modifierGroup.selectedMinimum = true
      } else {
        modifierGroup.selectedMinimum = false
      }
    }
    this.updateGroupWithModifierSelection(modifierGroup)
  }
  updateGroupWithModifierSelection(newGroup: any) {
    let item = this.state.item
    item.groups.map((group: any) => {
      if (group.group_id === newGroup.group_id) {
        group = newGroup
        return group
      }
    })

    let result = item.groups.every((e: any) => { return e.selectedMinimum === true })
    if (result) {
      this.setState({ showAddCartButton: true })
    }
    this.setState({ item })
  }

  addModifierToItem() {
    let item = this.state.item
    this.props.onModifierAdd(item)
  }

  updateModifier() {
    let item = this.state.item
    this.props.onModifierUpdate(item)
  }
  onClose() {
    console.log('called')
    this.setState({ item: this.props.modifierItem })
    this.props.onClose()
  }

  onDismiss(e:any){
    e.stopPropagation()
  }

  render() {
    const { item } = this.state
    return (
      <div className='selector-modal modifierSelector' onClick={(e:any) => this.onDismiss(e)}>
        <div className='modal-header'>
          <div className="close-icon" onClick={() => this.onClose()}>
            <FontAwesomeIcon icon={faTimes} size='lg' />
          </div>
          <p>Customize your</p>
          <h1 className='item-name'>{item.item_name}</h1>
        </div>
        <div className='modifierItems-container'>
          {
            item.groups.map((modifierGroup: any) => {
              return (
                <div key={modifierGroup.group_id} className='modifier-group'>
                  <div className='group-header'>
                    <div className='group-name'>{modifierGroup.group_name}{modifierGroup.group_type === 'mandatory' && <span className='star'> *</span>}</div>
                    {
                      modifierGroup.group_item_type === 'single_item' ?
                        <div className='group-message'> Select only 1 Item</div>
                        :
                        (modifierGroup.group_maximum > 0) &&
                        <div className='group-message'>
                          Select maximum {modifierGroup.group_maximum}
                        </div>

                    }
                  </div>
                  <div className='group-items'>
                    {modifierGroup.group_item_type &&
                      modifierGroup.items.map((modifierItem: any) => {
                        return (
                          <MenuItemWidget modifierItem onModifierItemClick={(selectedModifierItem: any) => this.onModifierItemClick(modifierGroup, selectedModifierItem)} modifierType={modifierGroup.group_item_type && modifierGroup.group_item_type} key={modifierItem.item_id} itemDetails={modifierItem} />
                        )
                      })
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
        {
          (this.state.showAddCartButton && !this.props.isEdit) &&
          <div className='add-to-cart' onClick={() => this.addModifierToItem()}>Add Modifier</div>
        }
        {
          this.props.isEdit &&
          <div className='add-to-cart' onClick={() => this.updateModifier()}>Update Modifier</div>
        }
      </div>
    )
  }
}
export default ModifierSelector
