import api from './api';

class App {
    constructor() {
        this.repositories = [];

        this.formEl = document.getElementById('repo-form');
        this.inputEl = document.querySelector('input');
        this.listEl = document.getElementById('repo-list');
        this.registerHandlers();
    }

    registerHandlers() {
        this.formEl.onsubmit = event => this.addRepository(event);
    }

    setLoading(loading =true) {
        
        if(loading == true){
            let loadingEl = document.createElement('span');
            loadingEl.appendChild(document.createTextNode('Loading...'));
            loadingEl.setAttribute('id', 'loading')
            this.formEl.appendChild(loadingEl);
        } else{
            document.getElementById('loading').remove();
        }
    }

    async addRepository(event) {
        event.preventDefault();

        const inputValue = this.inputEl.value;

        if(inputValue.length === 0) {
            alert('Please, write the user name!');
            return;
        }

        this.setLoading();

        try {
            const response = await api.get(`/users/${inputValue}/repos`);
            this.repositories = [];
            response.data.forEach(item => {
                const { name, description, html_url, owner: {avatar_url} } = item;
                this.repositories.push({
                    name,
                    description,
                    avatar_url,
                    html_url
                });
            });
            this.render();
        } catch(err) {
            alert("We haven't found the user! Please check the name informed!");
        }

        this.setLoading(false);
    }

    render(){
        this.listEl.innerHTML = '';
        this.repositories.forEach(repo => {
            let imgEl = document.createElement('img');
            imgEl.setAttribute('src', repo.avatar_url);

            let descriptionEl = document.createElement('p');
            descriptionEl.appendChild(document.createTextNode(repo.description));

            let linkEl = document.createElement('a');
            linkEl.setAttribute('target', '_blank');
            linkEl.setAttribute('href', repo.html_url);
            linkEl.appendChild(document.createTextNode(repo.name));

            let listItemEl = document.createElement('li');
            listItemEl.appendChild(imgEl);
            listItemEl.appendChild(linkEl);
            listItemEl.appendChild(descriptionEl);
            

            this.listEl.appendChild(listItemEl);
        });
    }
}

new App();