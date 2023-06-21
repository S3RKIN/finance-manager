import axios from 'axios';
axios.get('http://localhost:4000/auth/login').then(res => {
    const token = res.data.token;
    localStorage.setItem('token', token);

    console.log(res.request.token)
    console.log(token);
}).catch(err => {
        console.error(err);
    });
