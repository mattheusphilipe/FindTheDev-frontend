import React, {useEffect, useState} from 'react';
import './global.css'
import './App.css'
import './Sidebar.css'
import './Main.css'
import api from './Services/Api'

function App() {

  const [position, setPosition] = useState({latitude: '', longitude: ''});
  const [github_username, setGithub_username] = useState('');
  const [techs, setTechs] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => 
  {
    navigator.geolocation.getCurrentPosition(
    (position) => 
      {
        const {latitude, longitude} = position.coords;
        setPosition({latitude, longitude});
        console.log(position)

      }, (err) => 
      {
        console.error(err);
      }, 
      {
        timeout: 3000 
      }
    );

  }, []);

  useEffect(() => {
    api.get('/devs', {
      headers: {
       'Content-Type': 'application/json',
       "Access-Control-Allow-Origin": "*"
    }
  })
  .then((response) => {
    if (response.status === 200) {
      setUsers(response.data)
    }
  })
  .catch((err) => console.error(err.message));
  
  }, []);

   function handleListUsers() {

    return users.length && users.map((user => {
      const {bio, avatar_url, techs, github_username: username, _id, name} = user;
      return (
           <li key={_id} className="dev-item">
            <header>
              <img src={avatar_url} alt=""/>
              <div className="user-info">
                <strong>{name}</strong>
                <span>{techs && techs.join(', ')}</span>
              </div>
            </header>
            <p>{bio}</p>
            <a href={`https://github.com/${username}`}> Acessar perfil no Github </a>
          </li>
      );
    }));

  }

  async function handleAddDev(event) {
    event.preventDefault();
    
    const { latitude,longitude} = position;

      try {

        const response = await api.post('/users', {
          github_username,
          techs,
          latitude,
          longitude,
        },
        {
          headers: {
           'Content-Type': 'application/json',
           "Access-Control-Allow-Origin": "*"
        }
      }
      )
    
        setUsers([...users, response.data])

      } catch (err) {
        console.error(err)
      }
   

  }

  return (
    <div id="app">
      <aside>
      <strong> Cadastrar </strong>
      <form onSubmit={handleAddDev}>
        <fieldset className="input-block">
          <label htmlFor="github_username">Usuário do Github</label>
          <input type="text" 
          name="github_username" 
          id="github_username" 
          autoCapitalize="true" 
          onChange={ (e) => setGithub_username(e.target.value)}
          value={github_username} 
          required/>
        </fieldset>
        
        <fieldset className="input-block">
          <label htmlFor="techs">Tecnologias</label>
          <input 
          name="techs" 
          id="techs" 
          onChange={ (e) => setTechs(e.target.value)}
          value={techs} 
          required/>
        </fieldset>

        <fieldset className="input-group">
            <fieldset className="input-block">
              <label htmlFor="latitude">Latitude</label>
              <input 
               name="latitude" 
              id="latitude"
              onChange={ (e) => setPosition(e.target.value)}
              value={position.longitude} 
                />
            </fieldset>

            <fieldset className="input-block ">
              <label htmlFor="longitude">Longitude</label>
              <input
                name="longitude" 
                id="longitude" 
                onChange={ (e) => setPosition(e.target.value)}
                value={position.longitude}
              />
            </fieldset>
        </fieldset>
        

        <button type="submit">Salvar</button>
      </form>
      </aside>
      <main>
      <ul>
        {handleListUsers()}
      </ul>
      </main>
    </div>
  );
}

export default App;
