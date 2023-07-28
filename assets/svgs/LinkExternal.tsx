import React from 'react';

function LinkExternal({ url }) {
  return (
    <div>
      <svg
        width={'20px'}
        height={'20px'}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier"></g>
        <g id="SVGRepo_tracerCarrier"></g>
        <g id="SVGRepo_iconCarrier">
          <g>
            <path
              d="M11 3.99994H4V17.9999C4 19.1045 4.89543 19.9999 6 19.9999H18C19.1046 19.9999 20 19.1045 20 17.9999V12.9999"
              stroke="gray"
            ></path>{' '}
            <path d="M9 14.9999L20 3.99994" stroke="gray"></path>{' '}
            <path d="M15 3.99994H20V8.99994" stroke="gray"></path>
          </g>{' '}
          <defs>
            <clipPath id="clip0_429_11072">
              <rect width="24" height="24" fill="white"></rect>
            </clipPath>
          </defs>
        </g>
      </svg>
    </div>
  );
}

export default LinkExternal;
