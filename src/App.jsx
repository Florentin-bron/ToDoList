import {useEffect, useState} from 'react'
import React from "react";
import Modal from "react-modal";
import './App.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {

    const [listTodo, setListTodo] = useState([]);
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
        getTodosList()
    }, [])

    const getTodosList = () => {
        fetch('http://localhost:4567/api/todos')
            .then(response => {
                if(response.ok){
                    return response.json()
                }
                throw response
            })
            .then((data) => {
                setListTodo(() => data )
            })
            .catch(console.log)
    }

    const ajoutTodo = (e) =>{
        e.preventDefault();
        if(titre !== ""){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            };
            fetch(`http://localhost:4567/api/todos?titre=${titre}&description=${description}&date=${dueDate}&label=1`, requestOptions)
                .then(response => {
                    if(response.ok){
                        toast.success("Todo ajoutée !");
                        getTodosList()
                    }
                    else{
                        toast.error("Problème lors de la création de la Todo !");
                    }
                })
                .catch(console.log)
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
        setDueDate(e.target.value);
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
        status = status ? 1 : 0;
        let field = {};
        field['statut'] = status.toString();
        field = JSON.stringify(field)
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: field
        };
        fetch(`http://localhost:4567/api/todos?id=${id}`, requestOptions)
            .then(response => {
                if(response.ok){
                    toast.success("Todo modifié !", {autoClose: 1000,});
                    getTodosList()
                }
                else{
                    toast.error("Problème lors de la mise à jour du Todo !");
                }
            })
            .catch(console.log)
    }

    const deleteTodo = (e) => {
        if(confirm("Confirmer la supression de ce Todo ?")){
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            };
            fetch(`http://localhost:4567/api/todos?id=${e.target.id}`, requestOptions)
                .then(response => {
                    if(response.ok){
                        toast.success("Todo supprimé !", {autoClose: 2000,});
                        getTodosList()
                    }
                    else{
                        toast.error("Problème lors de la suppression du Todo !");
                    }
                })
                .catch(console.log)
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
        setDueDateEdit(e.target.value);
    }

    const editTodo = (e) => {
        e.preventDefault()

        let listField = {};
        listField['titre'] = titreEdit;
        listField['description'] = descriptionEdit;
        listField['due_date'] = dueDateEdit;
        let bodyContent = {};
        for(let name in listField){
            if(listField[name] !== ""){
                bodyContent[name] = listField[name]
            }
        }
        bodyContent = JSON.stringify(bodyContent)
        console.log(bodyContent)
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: bodyContent
        };
        fetch(`http://localhost:4567/api/todos?id=${e.target.id}`, requestOptions)
            .then(response => {
                if(response.ok){
                    toast.success("Todo modifié !", {autoClose: 2000,});
                    getTodosList()
                }
                else{
                    toast.error("Problème lors de la mise à jour du Todo !");
                }
            })
            .catch(console.log)
        setTitreEdit("");
        setDescriptionEdit("");
        setDueDateEdit("");
        toggleModal2()
    }

  return (
    <div>
        <Modal
            isOpen={isOpen}
            onRequestClose={toggleModal}
            contentLabel=""
            ariaHideApp={false}
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
            ariaHideApp={false}
        >
            <button onClick={toggleModal2}>Close modal</button>
            <form>
                <div className="form-group">
                    <label htmlFor="inputTitre">Titre</label>
                    <input type="titre" className="form-control" id="inputTitre"
                           aria-describedby="" placeholder="Titre de votre Todo" onChange={titreEditChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="textArea">Description</label>
                    <textarea style={{resize: 'none'}} className="form-control" id="textArea" rows="3" onChange={descEditChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="inputTitre">Due date</label>
                    <input type="date" className="form-control" id="inputDate"
                           aria-describedby="" placeholder="jj/mm/aaaa" onChange={dueDateEditChange} style={{width: '200px'}}/>
                </div>
                <div className="form-group">
                    <input id={curEditTodo} onClick={editTodo} type="submit" value="Modifier" />
                </div>
            </form>
        </Modal>


      <div className="container column">


          <button className="modal-toggle modal-button" onClick={toggleModal}>Ajouter un Todo</button>
          <ToastContainer />
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
                      <tr key={todo.id} id={todo.id}  >
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
                              {todo.due_date}
                          </td>
                          <td>
                              {todo.label_id}
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
