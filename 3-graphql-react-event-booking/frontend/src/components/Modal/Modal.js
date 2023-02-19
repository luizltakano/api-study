import React from "react";

import "./Modal.css";

const Modal = (props) => {
	return (
		<div className="modal">
			<div className="modal__header">
				<h1>{props.title}</h1>
			</div>
			<section className="modal__content">{props.children}</section>
			<section className="modal__actions">
				{props.canCancel && (
					<button
						className="btn btn__secondary"
						type="button"
						onClick={props.onCancel}
					>
						{props.cancelText}
					</button>
				)}
				{props.canCreate && (
					<button className="btn" type="button" onClick={props.onCreate}>
						{props.createText}
					</button>
				)}
			</section>
		</div>
	);
};

export default Modal;
