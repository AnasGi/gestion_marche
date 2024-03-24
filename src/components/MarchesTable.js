import React, { useState } from 'react';
import UseData from '../hooks/UserHook';
import print from '../imgs/print.png';
import excel from '../imgs/excel.png';
import filt from '../imgs/filter.png';
import * as XLSX from 'xlsx';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function MarchesTable() {
    const log = useSelector(data=>data.IsLogedIn)
    const navigate = useNavigate()
    const userData = UseData();
    const Users = Array.isArray(userData) ? userData.filter(user => user.id !== 'Admin') : [];
    const [numMarche , setNumMarche] = useState('')
    const [delaiMarche , setDelaiMarche] = useState('')
    const [typeBudget , setTypeBudget] = useState('')
    const [date , setDate] = useState({debut : "" , fin : ""})
    function exportToExcel() {
        let d = [];

        Users.forEach(user => {
            user.marches.forEach(marche => {
                d.push([
                    marche.num,
                    marche.objet,
                    marche.fournisseur,
                    marche.lieu,
                    marche.theme,
                    marche.soustheme,
                    marche.budget,
                    marche.dateDebut,
                    marche.dateAprob,
                    marche.datePlie,
                    marche.dateRecProv,
                    marche.dateRecDef,
                    marche.delai
                ]);
            });
        });

        const data = [
            [
                "Numéro",
                "Objet",
                'Fournisseur',
                'Lieu',
                'Theme',
                'Sous-theme',
                'Budget',
                'Date order de service',
                'Date approbation',
                'Date ouverture du plie',
                'Date Recep provisoire',
                'Date Recep definitive',
                'Delai'
            ],
            ...d
        ];

        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        XLSX.writeFile(wb, 'marchés.xlsx');
    }

    function Filterer(marchesToRender){
        const {debut , fin} = date
        if (numMarche !== "") {
            marchesToRender = marchesToRender.filter(marche => marche.num === numMarche);
        }
        if (typeBudget !== "") {
            marchesToRender = marchesToRender.filter(marche => marche.budget === typeBudget);
        }
        if (debut !== "" && fin !== "") {
            marchesToRender = marchesToRender.filter(marche => (marche.dateDebut >= debut && marche.dateDebut <= fin));
        }
        if (delaiMarche !== "") {
            marchesToRender = marchesToRender.filter(marche => marche.delai === delaiMarche);
        }
        return marchesToRender
    }

    return (
        log ?
            <div className="marches-container">
                <div className='no-print'>
                    <details style={{userSelect:"none" , cursor:"pointer"}}>
                        <summary>
                            <img src={filt} alt='' className='logoImg'/>
                            <p>Filtrer</p>
                        </summary>
                        <div className='filterByDate'>
                            <fieldset>
                                <legend>Par N° du marché</legend>
                                <select onChange={e=>setNumMarche(e.target.value)}>
                                <option></option>
                                    {
                                        Users.map(user=>user.marches.map((marche , i)=><option key={i}>{marche.num}</option>))
                                    }
                                </select>
                            </fieldset>

                            <fieldset>
                                <legend>Par date d'ordre de service :</legend>
                                <fieldset style={{padding:"0" , border:"none"}}>
                                    <legend style={{fontSize:"14px"}}>Date initiale</legend>
                                    <input type='date' onChange={e=>setDate({...date , debut : e.target.value})}/>
                                </fieldset>
                                <fieldset style={{padding:"0" , border:"none"}}>
                                    <legend style={{fontSize:"14px"}}>Date finale</legend>
                                    <input type='date' onChange={e=>setDate({...date , fin : e.target.value})}/>
                                </fieldset>
                            </fieldset>

                            <fieldset>
                                <legend>Par type du budget</legend>
                                <select onChange={e=>setTypeBudget(e.target.value)}>
                                    <option></option>
                                    <option>BG</option>
                                    <option>BP</option>
                                    <option>INDH</option>
                                </select>
                            </fieldset>

                            <fieldset>
                                <legend>Par delai</legend>
                                <input type='number' placeholder='Filtrer par delai' onChange={e=>setDelaiMarche(e.target.value)}/>
                            </fieldset>
                        </div>
                    </details>

                    <div>
                    </div>

                    <div>
                        <button onClick={() => window.print()}>
                            <img className='logoImg' src={print} alt='document' title='document PDF'/>
                        </button>
                        
                        <button onClick={exportToExcel}>
                            <img className='logoImg' src={excel} alt='document excel' title='document excel'/>
                        </button>
                    </div>
                </div>
                <table className="marches-table">
                    <thead>
                        <tr>
                            <th><textarea rows={2} disabled value={"Numéro"} /></th>
                            <th><textarea rows={2} disabled value={"Objet"} /></th>
                            <th><textarea rows={2} disabled value={"Fournisseur"} /></th>
                            <th><textarea rows={2} disabled value={"Lieu"} /></th>
                            <th><textarea rows={2} disabled value={"Theme"} /></th>
                            <th><textarea rows={2} disabled value={"Sous-theme"} /></th>
                            <th><textarea rows={2} disabled value={"Budget"} /></th>
                            <th><textarea rows={2} disabled value={"Date order de service"} /></th>
                            <th><textarea rows={2} disabled value={"Date approbation"} /></th>
                            <th><textarea rows={2} disabled value={"Date ouverture du plie"} /></th>
                            <th><textarea rows={2} disabled value={"Date Recep provisoire"} /></th>
                            <th><textarea rows={2} disabled value={"Date Recep definitive"} /></th>
                            <th><textarea rows={2} disabled value={"Delai"} /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Users.map((user) => {
                            let marchesToRender = user.marches;     
                            
                            return Filterer(marchesToRender).map((marche, index) => 
                                <tr key={index}>
                                    <td>{marche.num}</td>
                                    <td>{marche.objet}</td>
                                    <td>{marche.fournisseur}</td>
                                    <td>{marche.lieu}</td>
                                    <td>{marche.theme}</td>
                                    <td>{marche.soustheme}</td>
                                    <td>{marche.budget}</td>
                                    <td>{marche.dateDebut}</td>
                                    <td>{marche.dateAprob}</td>
                                    <td>{marche.datePlie}</td>
                                    <td>{marche.dateRecProv}</td>
                                    <td>{marche.dateRecDef}</td>
                                    <td>{marche.delai} mois</td>
                                </tr>
                            )
                        })
                        }
                        
                    </tbody>
                </table>
            </div>
        :
        navigate('/')
    );
}