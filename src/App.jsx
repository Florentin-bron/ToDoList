import {useEffect, useState} from 'react'
import './App.css'
import {todos} from "./todos";
import Modal from "react-modal";

import React from "react";
import ReactDOM from "react-dom";

function App() {

    const [listTodo, setListTodo] = useState(localStorage.getItem('localTodos') ? JSON.parse(localStorage.getItem('localTodos')) : todos);
    const [titre, setTitre] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    function toggleModal() {
        setIsOpen(!isOpen);
    }

    useEffect(() => {
        localStorage.setItem('localTodos', JSON.stringify(listTodo))
    })

    const ajoutTodo = (e) =>{
        e.preventDefault();
        if(titre !== ""){
            const today = new Date();
            const date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
            const maxId = parseInt(listTodo.reduce(
                (max, todo) => (todo.id > max ? todo.id : max),
                listTodo[0].id
            ));
            const test = {
                'id': (maxId+1).toString(),
                'titre': titre,
                'description': description,
                'dueDate': dueDate,
                'statut': false,
                'labelId': '1',
                'creationDate': date.toString(),
            }
            setListTodo(listTodo => [...listTodo, test])
            setTitre("");
            setDescription("");
            toggleModal()
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

    const dueDateChange = (e) => {
        e.preventDefault();
        setDueDate(e.target.value.replace(/-/g, "/"));
    }

  return (
    <div>
        <Modal
            isOpen={isOpen}
            onRequestClose={toggleModal}
            contentLabel="My dialog"
        >
            <button onClick={toggleModal}>Close modal</button>
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
                <div className="form-group">
                    <label htmlFor="inputTitre">Due date <p style={{color: 'red', display: 'inline'}}>*</p></label>
                    <input required type="date" className="form-control" id="inputDate"
                           aria-describedby="" placeholder="jj/mm/aaaa" onChange={dueDateChange} style={{width: '200px'}}/>
                </div>
                <div className="form-group">
                    <input onClick={ajoutTodo} type="submit" value="Ajouter" />
                </div>
            </form>
        </Modal>


      <div className="container column">


          <button className="modal-toggle" onClick={toggleModal}>Ajouter un Todo</button>

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
