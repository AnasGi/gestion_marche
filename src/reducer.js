export default function reducer(state = {IsLogedIn : false} , action){
    switch(action.type){
        case 'logedIn' :
            return {...state , IsLogedIn : true}
        case 'logedOut' :
            return {...state , IsLogedIn : false}
        default :
            return state;
    }
}