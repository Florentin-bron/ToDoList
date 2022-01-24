import { useState } from 'react'
import './App.css'
import {todos} from "./todos";

import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";

function App() {
    const [listTodo, setListTodo] = useState(todos);
    const [isOpen, setIsOpen] = React.useState(false);
    const [titre, setTitre] = useState("");
    const [description, setDescription] = useState("");

    const showModal = () => {
        setIsOpen(true);
    };

    const hideModal = () => {
        setIsOpen(false);
    };

    const ajoutTodo = (e) =>{
        e.preventDefault();
        if(titre !== ""){
            let test = {
                'id': listTodo.length.toString()+1,
                'titre': titre,
                'description': description,
                'dueDate': '10/11/2021',
                'statut': false,
                'labelId': '1',
                'creationDate': '03/11/2021',
            }
            console.log(listTodo)
            setListTodo(listTodo => [...listTodo, test])
            console.log(listTodo)
        }
    }

    const titreChange = (e) => {
        e.preventDefault();
        setTitre(e.target.value);
    }

    const descChange = (e) => {
        e.preventDefault();
        setDescription(e.target.value);
    }

  return (
    <div>
        <Modal className='modalCustom' style={{opacity:1}} show={isOpen} onHide={hideModal}>
            <Modal.Header>
                <Modal.Title>Ajouter un Todo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="form-group">
                        <label htmlFor="inputTitre">Titre <p style={{color: 'red', display: 'inline'}}>*</p></label>
                        <input required type="titre" className="form-control" id="inputTitre"
                               aria-describedby="" placeholder="Titre de votre Todo" onChange={titreChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="textArea">Description</label>
                        <textarea style={{resize: 'none'}} className="form-control" id="textArea" rows="3" onChange={descChange}/>
                    </div>
                    <button  onClick={ajoutTodo} className="btn btn-primary">Ajouter</button>
                </form>
            </Modal.Body>
        </Modal>
      <div className="column">


          <button className='btn btn-primary' onClick={showModal}>Ajouter un Todo</button>

          <div>
              Liste des Todos :
              <ul className="list-group">
                  {listTodo.map(todo => <li className="list-group-item" id={todo.id} key={todo.id} ><input defaultChecked={todo.statut} type='checkbox'/> {todo.titre} {todo.description} </li>)}
              </ul>
          </div>


      </div>
    </div>
  )
}

export default App
