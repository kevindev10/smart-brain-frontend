import React from 'react';
import './ImageLinkForm.css';



const ImageLinkForm = ({onInputChange,onSubmitButton})=>{
	return(
		<div>
			<p className='f3'>
					{'This Magic Brain will detect faces in your picture.Give it a try.'}
			</p>
			<div className='center'>
				<div className='form pa4 br3 center shadow-5'>
					<input 
					 onChange={onInputChange}
					 className='f4 pa2 w-70 center'type='text'
					 />
					<button 
					 onClick={onSubmitButton}
					 className='f4 w-30 grow link ph3 pv2 dib white bg-light-purple'
					 >Detect</button>
				</div>
			</div>
		</div>
	);
}

export default ImageLinkForm;