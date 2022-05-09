import {useEffect, useState} from 'react'
import React from "react";
import Modal from "react-modal";
import './App.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CirclePicker  } from 'react-color';



function App() {

    const [listTodo, setListTodo] = useState([]);
    const [listLabel, setListLabel] = useState([]);
    const [titre, setTitre] = useState("");
    const [description, setDescription] = useState("");
    const [label, setLabel] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [done, setDone] = useState(false)
    const [curEditTodo, setCurEditTodo] = useState("")
    const [titreEdit, setTitreEdit] = useState("");
    const [descriptionEdit, setDescriptionEdit] = useState("");
    const [dueDateEdit, setDueDateEdit] = useState("");
    const [labelEdit, setLabelEdit] = useState("");
    const [nomLabel, setNomLabel] = useState("");
    const [couleurLabel, setCouleurLabel] = useState("");

    function toggleModal() {
        setIsOpen(!isOpen);
    }

    function toggleModal2() {
        setIsOpen2(!isOpen2);
    }

    useEffect(() => {
        getLabelList()
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
                document.getElementById("loader").style.display = "none"
                setListTodo(() => data )
            })
            .catch(console.log)
    }

    const getLabelList = () => {
        fetch('http://localhost:4567/api/labels')
            .then(response => {
                if(response.ok){
                    return response.json()
                }
                throw response
            })
            .then((data) => {
                setListLabel(() => data)
            })
            .catch(console.log)
    }

    const ajoutTodo = (e) =>{
        e.preventDefault();
        console.log(label)
        if(titre !== "" && dueDate !== "" && label !== ""){
            console.log(`http://localhost:4567/api/todos?titre=${titre}&description=${description}&date=${dueDate}&label=${label}`)
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            };
            fetch(`http://localhost:4567/api/todos?titre=${titre}&description=${description}&date=${dueDate}&label=${label}`, requestOptions)
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
            setLabel("");
            toggleModal()
        }
        else {
            toast.error("Champs requis non renseignés");
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
            //e.target.closest('tr').style.backgroundColor = "rgba(155,201,76,0.3)"
        }
        else {
            setDone(false)
            switchStatus(e.target.id, e.target.checked)
            //e.target.closest('tr').style.backgroundColor = "rgba(155,201,76,0)"
        }

    }

    function setCheckedStyle(e){
        //e.target.closest('tr').style.backgroundColor = "rgba(155,201,76,0.3)"
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
            let id = ""
            if(e.target.id == ""){
                id = e.target.closest(".btn-danger").id
            }
            else{
                id = e.target.id
            }
            fetch(`http://localhost:4567/api/todos?id=${id}`, requestOptions)
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

    const todoAddLabelChange = (e) => {
        e.preventDefault();
        setLabel(e.target.id);
    }

    const todoAddLabelChangeEdit = (e) => {
        e.preventDefault();
        setLabelEdit(e.target.id);
    }

    const nomLabelChange = (e) => {
        e.preventDefault();
        setNomLabel(e.target.value);
    }

    const handleChangeComplete = (color) => {
        setCouleurLabel(color.hex);
    };

    const findLabelById = (id) => {
        if(typeof(id) === "number"){
            const index = listLabel.map(function(x) {return x.id; }).indexOf(id)
            return (<span className="customLabel rounded p-2" style={{backgroundColor: `#${listLabel[index].couleur}`, color:"white"}}>{listLabel[index].nom}</span>)
        }
    }

    const ajoutLabel = (e) =>{
        e.preventDefault();
        if(nomLabel !== "" && couleurLabel !== ""){
            console.log(nomLabel, couleurLabel)
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            };
            fetch(`http://localhost:4567/api/labels?nom=${nomLabel}&couleur=${couleurLabel.replace("#", "")}`, requestOptions)
                .then(response => {
                    if(response.ok){
                        toast.success("Label ajoutée !");
                        getLabelList()
                    }
                    else{
                        toast.error("Problème lors de la création du Label !");
                    }
                })
                .catch(console.log)
            setNomLabel("");
            setCouleurLabel("");
        }
        else {
            toast.error("Des champs requis ne sont pas renseignés !");
        }
    }

    const editTodo = (e) => {
        e.preventDefault()

        let listField = {};
        listField['titre'] = titreEdit;
        listField['description'] = descriptionEdit;
        listField['due_date'] = dueDateEdit;
        listField['label_id'] = labelEdit;
        let bodyContent = {};
        for(let name in listField){
            if(listField[name] !== ""){
                bodyContent[name] = listField[name]
            }
        }
        bodyContent = JSON.stringify(bodyContent)
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: bodyContent
        };
        let id = ""
        if(e.target.id == ""){
            id = e.target.closest(".btn-info").id
        }
        else{
            id = e.target.id
        }
        fetch(`http://localhost:4567/api/todos?id=${id}`, requestOptions)
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
            <button onClick={toggleModal} type="button" className="btn btn-danger float-right text-white m-2 font-weight-bold">🗙</button>
            <form className="mt-5">
                <div className="form-group">
                    <label htmlFor="inputTitre">Titre <p style={{color: 'red', display: 'inline'}}>*</p></label>
                    <input required type="titre" className="form-control" id="inputTitre"
                           aria-describedby="" placeholder="Titre de votre Todo" onChange={titreChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="textArea">Description</label>
                    <textarea style={{resize: 'none'}} className="form-control" id="textArea" rows="3" onChange={descChange}/>
                </div>
                <div className="row">
                    <div className="col-4">
                        <div className="form-group">
                            <label htmlFor="inputTitre">Due date <p style={{color: 'red', display: 'inline'}}>*</p></label>
                            <input required type="date" className="form-control" id="inputDate"
                                   aria-describedby="" placeholder="jj/mm/aaaa" onChange={dueDateChange} style={{width: '200px'}}/>
                        </div>
                    </div>
                    <div className="col-8">
                        <label className="pr-2" htmlFor="inputTitre">Label <p style={{color: 'red', display: 'inline'}}>*</p></label>
                        <div className="btn-group-vertical" role="group" aria-label="Basic mixed styles example">
                            {listLabel.map(selectLabel =>
                                <button id={selectLabel.id} key={selectLabel.id} type="button" className="btn customLabelBTN" style={{backgroundColor: `#${selectLabel.couleur}`}} onClick={todoAddLabelChange}>{selectLabel.nom}</button>
                            )}
                        </div>
                    </div>
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
            <button onClick={toggleModal2} type="button" className="btn btn-danger float-right text-white m-2 font-weight-bold">🗙</button>
            <form className="mt-5">
                <div className="form-group">
                    <label htmlFor="inputTitre">Titre</label>
                    <input type="titre" className="form-control" id="inputTitre"
                           aria-describedby="" placeholder="Titre de votre Todo" onChange={titreEditChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="textArea">Description</label>
                    <textarea style={{resize: 'none'}} className="form-control" id="textArea" rows="3" onChange={descEditChange}/>
                </div>

                <div className="row">
                    <div className="col-4">
                        <div className="form-group">
                            <label htmlFor="inputTitre">Due date</label>
                            <input type="date" className="form-control" id="inputDate"
                                   aria-describedby="" placeholder="jj/mm/aaaa" onChange={dueDateEditChange} style={{width: '200px'}}/>
                        </div>
                    </div>
                    <div className="col-8">
                        <label className="pr-2" htmlFor="inputTitre">Label</label>
                        <div className="btn-group-vertical" role="group" aria-label="Basic mixed styles example">
                            {listLabel.map(selectLabel =>
                                <button id={selectLabel.id} key={selectLabel.id} type="button" className="btn customLabelBTN" style={{backgroundColor: `#${selectLabel.couleur}`}} onClick={todoAddLabelChangeEdit}>{selectLabel.nom}</button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <input id={curEditTodo} onClick={editTodo} type="submit" value="Modifier" />
                </div>
            </form>
        </Modal>


      <div className="container column">
          <div className="container">
              <button type="button" className="btn m-2 btn-success" onClick={toggleModal}>Ajouter un Todo</button>
              <button type="button" className="btn btn-info" data-toggle="collapse" data-target="#collapseAddLabel">
                  Ajouter un label
              </button>
              <div id="collapseAddLabel" className="collapse">
                  <div className="container">
                      <div className="form-group">
                          <label htmlFor="inputNom">Nom</label>
                          <input type="titre" className="form-control" id="inputNom"
                                 aria-describedby="" placeholder="Nom du label" onChange={nomLabelChange}/>
                      </div>
                      <div className="m-2">
                          <CirclePicker
                              onChangeComplete={ handleChangeComplete }
                          />
                      </div>
                      <div className="form-group">
                          <input onClick={ajoutLabel} type="submit" value="Créer le label" />
                      </div>
                  </div>
              </div>
          </div>
          <ToastContainer />
          <div>
              {listTodo.map(todo =>
                  <div key={todo.id} id={todo.id} className="card w-100 mb-2">
                      <div className="card-body">
                          <h5>{todo.titre}</h5>
                          <div className="row">
                              <div style={{width: '5%'}}>
                                  <input id={todo.id} className="checkboxTodo  ml-2" defaultChecked={todo.statut} onChange={checkboxChange} type='checkbox'/>
                              </div>
                              <div className="border p-2 rounded" style={{width: ' 55%'}}>
                                  {todo.description}
                              </div>
                              <div className="text-center" style={{width: '10%'}}>
                                  <div className="center-block">
                                      Due Date
                                  </div>
                                  <span className="badge badge-secondary">{todo.due_date}</span>
                              </div>
                              <div style={{width: '15%'}}>
                                  <div className="justify-content-center text-center">
                                      {findLabelById(todo.label_id)}
                                  </div>
                              </div>
                              <div style={{width: '15%'}}>
                                  <button id={todo.id} onClick={setupModal2} type="button" className="btn btn-info mr-1 mt-n2"><span className="h5">🖊️</span></button>
                                  <button id={todo.id} onClick={deleteTodo} type="button" className="btn btn-danger mt-n2"><span className="h5">🗑️</span></button>
                              </div>
                          </div>
                      </div>
                  </div>
              )}
              <div id="loader" className="customloader text-center">
                  <img src="src/loader.gif"/>
              </div>
          </div>
      </div>
    </div>
  )
}

export default App
