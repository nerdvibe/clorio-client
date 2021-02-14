import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const TOAST_TIMEOUT = 2500

const Alert = props => {
  const [node] = useState(document.createElement('div'));

  const removeNode = () => {
    if (document.querySelector('#toast').children.length) {
      document.querySelector('#toast').childNodes[0].remove();
    }
  };

  useEffect(() => {
    if (props.show) {
      const doc = document.querySelector('#toast').appendChild(node)
      doc.classList.add('toast')
      doc.classList.add(props.type);

      setTimeout(() => {
        removeNode();
        props.hideToast();
      }, TOAST_TIMEOUT);
    } else {
      removeNode();
    }

    return () => removeNode();
  }, [node, props.show, props.type]);

  return ReactDOM.createPortal(props.children, node);
};

export default Alert;