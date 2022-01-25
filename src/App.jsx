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
    const [isOpen2, setIsOpen2] = useState(false);
    const [done, setDone] = useState(false)
    const [curEditTodo, setCurEditTodo] = useState("")
    const [titreEdit, setTitreEdit] = useState("");
    const [descriptionEdit, setDescriptionEdit] = useState("");
    const [dueDateEdit, setDueDateEdit] = useState("");

    function toggleModal() {
        setIsOpen(!isOpen);
    }

    function toggleModal2() {
        setIsOpen2(!isOpen2);
    }

    useEffect(() => {
        localStorage.setItem('localTodos', JSON.stringify(listTodo))
    })

    const ajoutTodo = (e) =>{
        e.preventDefault();
        if(titre !== ""){
            const today = new Date();
            const date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
            console.log(listTodo.length)
            let maxId = 0
            if(listTodo.length !== 0) {
                maxId = parseInt(listTodo.reduce(
                    (max, todo) => (todo.id > max ? todo.id : max),
                    listTodo[0].id
                ));
            }

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

    const checkboxChange = (e) => {
        if(e.target.checked){
            setDone(true)
            switchStatus(e.target.id, e.target.checked)
        }
        else {
            setDone(false)
            switchStatus(e.target.id, e.target.checked)
        }

    }

    const switchStatus = (id, status) => {
        const index = listTodo.map(function(x) {return x.id; }).indexOf(id)
        listTodo[index].statut = status
        setListTodo(listTodo => [...listTodo])
    }

    const deleteTodo = (e) => {
        if(confirm("Confirmer la supression de ce Todo ?")){
            const index = listTodo.map(function(x) {return x.id; }).indexOf(e.target.id)
            listTodo.splice(index, 1)
            setListTodo(listTodo => [...listTodo])
        }
    }

    const setupModal2 = (e) =>{
        e.preventDefault()
        setCurEditTodo(e.target.id)
        toggleModal2()
    }

    const titreEditChange = (e) => {
        e.preventDefault();
        setTitreEdit(e.target.value);
    }

    const descEditChange = (e) => {
        e.preventDefault();
        setDescriptionEdit(e.target.value);
    }

    const dueDateEditChange = (e) => {
        e.preventDefault();
        setDueDateEdit(e.target.value.replace(/-/g, "/"));
    }

    const editTodo = (e) => {
        e.preventDefault()
        const index = listTodo.map(function(x) {return x.id; }).indexOf(e.target.id)
        listTodo[index].titre = titreEdit
        listTodo[index].description = descriptionEdit
        listTodo[index].dueDate = dueDateEdit
        setListTodo(listTodo => [...listTodo])
        toggleModal2()
    }

  return (
    <div>
        <Modal
            isOpen={isOpen}
            onRequestClose={toggleModal}
            contentLabel=""
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

        <Modal
            isOpen={isOpen2}
            onRequestClose={toggleModal2}
            contentLabel=""
        >
            <button onClick={toggleModal2}>Close modal</button>
            <form>
                <div className="form-group">
                    <label htmlFor="inputTitre">Titre <p style={{color: 'red', display: 'inline'}}>*</p></label>
                    <input required type="titre" className="form-control" id="inputTitre"
                           aria-describedby="" placeholder="Titre de votre Todo" onChange={titreEditChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="textArea">Description</label>
                    <textarea style={{resize: 'none'}} className="form-control" id="textArea" rows="3" onChange={descEditChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="inputTitre">Due date <p style={{color: 'red', display: 'inline'}}>*</p></label>
                    <input required type="date" className="form-control" id="inputDate"
                           aria-describedby="" placeholder="jj/mm/aaaa" onChange={dueDateEditChange} style={{width: '200px'}}/>
                </div>
                <div className="form-group">
                    <input id={curEditTodo} onClick={editTodo} type="submit" value="Modifier" />
                </div>
            </form>
        </Modal>


      <div className="container column">


          <button className="modal-toggle modal-button" onClick={toggleModal}>Ajouter un Todo</button>

          <div>
              <table style={{width: '100%'}}>
                  <thead style={{backgroundColor: '#adadad'}}>
                  <tr>
                      <th style={{width: '5%'}}>Statut</th>
                      <th style={{width: '15%'}}>Titre</th>
                      <th style={{width: '55%'}}>Description</th>
                      <th style={{width: '10%'}}>Due date</th>
                      <th style={{width: '5%'}}>Label</th>
                      <th style={{width: '5%'}}>Edit</th>
                      <th style={{width: '5%'}}>Delete</th>
                  </tr>
                  </thead>
                  <tbody>
                  {listTodo.map(todo =>
                      <tr id={todo.id} key={todo.id} >
                          <td>
                              <input id={todo.id} className="checkboxTodo" defaultChecked={todo.statut} onChange={checkboxChange} type='checkbox'/>
                          </td>
                          <td>
                              {todo.titre}
                          </td>
                          <td>
                              {todo.description}
                          </td>
                          <td>
                              {todo.dueDate}
                          </td>
                          <td>
                              {todo.labelId}
                          </td>
                          <td>
                              <button id={todo.id} onClick={setupModal2}>🖊️</button>
                          </td>
                          <td>
                              <button id={todo.id} onClick={deleteTodo}>🗑️</button>
                          </td>
                      </tr>)}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  )
}

export default App
