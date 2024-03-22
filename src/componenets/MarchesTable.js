import React from 'react';
import UseData from '../hooks/UserHook';
import print from '../imgs/print.png'
import excel from '../imgs/excel.png'
import * as XLSX from 'xlsx'


export default function MarchesTable() {
    const userData = UseData();


    const Users = Array.isArray(userData) ? userData.filter(user => user.id !== 'Admin') : [];
    //KATHEL PRBLM DYAL FILTER IS NOT A FUNCTION

    function exportToExcel(){

        let d 

        d = Users.map(user => (
            user.marches.map(marche => ([
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
            ]))
          ))

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
            d
            
          ];

          const ws = XLSX.utils.aoa_to_sheet(data);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      
          XLSX.writeFile(wb, 'marchés.xlsx');
    }

    return (
        <div className="marches-container">
            <div className='no-print'>
                <button onClick={()=>window.print()}>
                    <img className='logoImg' src={print} alt='document'/>
                </button>
                
                <button onClick={exportToExcel}>
                    <img className='logoImg' src={excel} alt='document excel'/>
                </button>
            </div>
            <table className="marches-table">
                <thead>
                    <tr>
                        <th><textarea rows={2} disabled>Numéro</textarea></th>
                        <th><textarea rows={2} disabled>Objet</textarea></th>
                        <th><textarea rows={2} disabled>Fournisseur</textarea></th>
                        <th><textarea rows={2} disabled>Lieu</textarea></th>
                        <th><textarea rows={2} disabled>Theme</textarea></th>
                        <th><textarea rows={2} disabled>Sous-theme</textarea></th>
                        <th><textarea rows={2} disabled>Budget</textarea></th>
                        <th><textarea rows={2} disabled>Date order de service</textarea></th>
                        <th><textarea rows={2} disabled>Date approbation</textarea></th>
                        <th><textarea rows={2} disabled>Date ouverture du plie</textarea></th>
                        <th><textarea rows={2} disabled>Date Recep provisoire</textarea></th>
                        <th><textarea rows={2} disabled>Date Recep definitive</textarea></th>
                        <th><textarea rows={2} disabled>Delai</textarea></th>
                    </tr>
                </thead>
                <tbody>
                    {Users.map((user) => (
                        user.marches.map((marche, index) => (
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
                        ))
                    ))}
                </tbody>
            </table>
        </div>
    );
}