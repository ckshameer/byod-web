import React from 'react'

const NormalSpinner = () => {
  return (
    <div className='preloader'>
      <img src={require('../../assets/FadingLines.svg')} alt='Preloader'/>
    </div>
  )
}

// const LoginSpinner = () => {
//   return (
//     <div className='preloader'>
//       <div className='loginspinner'></div>
//     </div>
//   )
// }

export { NormalSpinner }
