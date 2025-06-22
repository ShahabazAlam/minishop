import React from 'react';
import { Modal } from 'semantic-ui-react'

export const ToastNotification = (visible, Onclose, message) => {
    visible = true;
    return (
        <Modal
            size='mini'
            open={visible}
            onClose={Onclose}
            style={{ height: '120px' }}
            className='text-primary text-center'
        >
            <Modal.Header>
                Message
                <a onClick={Onclose} style={{ color: 'red', cursor: "pointer", float: 'right' }}>x</a>
            </Modal.Header>
            <Modal.Content>
                <p>{message}</p>
            </Modal.Content>
        </Modal >
    );
}
