import React from 'react'

export default function CarteMarche(props) {
  return (
    props.data !== undefined && props.data.map(
      dt=>dt.marches.map(marche=>
        <div key={props.data.id} className='MarcheCont'>

          <div>
            <h1>{dt.username}</h1>
            <p>{marche.num}</p>    
            <hr/>
            <p>{marche.objet}</p>    
          </div>

          <div>

            <div>
              <p>Theme : {marche.theme}</p>    
              <p>Sous-theme : {marche.soustheme}</p>    
            </div>

            <div>

              <fieldset>
                <legend>Date Début</legend>
                <p>{marche.dateDebut}</p>    
              </fieldset>

              <fieldset>
                <legend>Date Fin</legend>
                <p>{marche.dateFin}</p>    
              </fieldset>

              <fieldset>
                <legend>Delai</legend>
                <p>{(new Date(marche.dateFin) - new Date(marche.dateDebut)) / (1000 * 3600 * 24)} jours</p>
              </fieldset>

            </div>

            <div>
              <button className='stop'>Ordre d'arrét</button>
              <button className='reprise'>Ordre de reprise</button>
            </div>
            
          </div>

        </div>
      )
    )
    
  )
}
