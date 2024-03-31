import React from 'react'

/**
 * @returns generic text component 
 * if @short is true it will have a specific height (h-24) and it will have a shadow that hides the overflow
*/
function TextBox({content, short=false}) {
      return (
            <div className={`p-2 mb-4 border rounded-xl ${short && 'h-24 relative group overflow-y-hidden'}`}>
                  <p className='text-justify'>{content}</p>
                  {short && <span className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white opacity-100 z-20 h-24"></span>}
            </div>
      )
}

export default TextBox