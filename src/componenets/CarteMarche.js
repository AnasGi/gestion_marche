import React from 'react'

export default function CarteMarche({marche , users}) {

  return (
    marche.map(marche=>
        <div key={marche.num} className='MarcheCont'>
          <div>
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
}
