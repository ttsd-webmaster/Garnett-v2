// @flow
import API from 'api/API.js';
import './UrlApp.css'
import 'containers/PledgeApp/PledgeApp.css';
import Snackbar from 'material-ui/Snackbar';
import { isMobile } from 'helpers/functions';
import { PullToRefreshSpinner } from 'helpers/loaders';
import type { User } from 'api/models';
import React, { PureComponent, type Node } from 'react';

type Props = {
  history: RouterHistory,
  state: User // TODO: Use store instead of passing down state
};

type State = {
  index: number
};

export class UrlApp extends PureComponent<Props, State> {
  state = {
    index: 0,
    urlToShorten: "",
    newUrl: "",
    open: false,
    message: ''
  };

  get body(): ?Node {
    return (
			<form>
				<label htmlFor="urlToShorten" className="url-input">
				<input
					className="url-input"
					type="text"
					placeholder="Enter Url to Shorten"
					autoComplete="off"
					onChange={this.handleUrlChange}
				/>
				<input
					className="url-output"
					type="text"
					placeholder="Enter New Url"
					autoComplete="off"
					onChange={this.handleNewUrlChange}
				/>
				<button className="convert-url-button" onClick={this.convertUrl}>Convert</button>
        <button className="update-url-button" onClick={this.updateUrl}>Update</button>
				</label>
			</form>
    )
  }
  
  handleUrlChange = (event: SyntheticEvent<>) => {
    const urlToShorten= event.target.value;
    this.setState({ urlToShorten });
  }

	handleNewUrlChange = (event: SyntheticEvent<>) => {
    const newUrl= event.target.value;
    this.setState({ newUrl });
  }
  
  handleRequestOpen = (message: string) => {
    this.setState({ message, open: true });
  }

  handleRequestClose = () => this.setState({ open: false });

	convertUrl = (event) => {
		const {urlToShorten, newUrl} = this.state;
		if (urlToShorten !== "" && newUrl !== "" && urlToShorten !== newUrl) {
      if (this.isUrl(urlToShorten) === false && this.isThetaTauUrl(newUrl) === false) {
        this.handleRequestOpen('Invalid URL to shorten and the new URL must start with "www.ucsdthetatau.org/"!');
      } else if (this.isUrl(urlToShorten) === false) { 
        this.handleRequestOpen('Invalid URL to shorten!')
      } else if (this.isThetaTauUrl(newUrl) === false) {
        this.handleRequestOpen('The new URL must start with "www.ucsdthetatau.org/"!')
      }
			let params = {urlToShorten, newUrl}
			API.createUrl(params).then((res) => {
        this.handleRequestOpen(res.data)
      })
    } else {
      this.handleRequestOpen('Invalid URLs!')
    }
    event.preventDefault()
  }
  
  updateUrl = (event) => {
		const {urlToShorten, newUrl} = this.state;
		if (urlToShorten !== "" && newUrl !== "" && urlToShorten !== newUrl) {
      if (this.isUrl(urlToShorten) === false && this.isThetaTauUrl(newUrl) === false) {
        this.handleRequestOpen('Invalid URL to shorten and the new URL must start with "www.ucsdthetatau.org/"!')
      } else if (this.isUrl(urlToShorten) === false) { 
        this.handleRequestOpen('Invalid URL to shorten!')
      } else if (this.isThetaTauUrl(newUrl) === false) {
        this.handleRequestOpen('The new URL must start with "www.ucsdthetatau.org/"!')
      }
			let params = {urlToUpdate: urlToShorten, newUrl}
			API.updateUrl(params).then((res) => {
        this.handleRequestOpen(res.data)
      })
    } else {
      this.handleRequestOpen('Invalid URLs!')
    }
    event.preventDefault()
	}

  isUrl(str) {
    const regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str)) {
      return true;
    }
    return false;
  }
 
  isThetaTauUrl(str) {
    return (this.isUrl(str) && str.includes('ucsdthetatau.org/'));
  }

  componentDidMount() {
    localStorage.setItem('route', 'url-app');
  }

  goHome = () => {
    const { history } = this.props;
    const prevPath = history.location.state || 'home';
    history.push(prevPath);
  }

  render() {
    const { open, message } = this.state;
    return (
      <div>
        <div id="url-container">
          <span id="back-button" onClick={this.goHome}>←</span>
          <h1 id="url-app-header">{ this.header }</h1>
          { this.body }
          <Snackbar
            open={open}
            message={message}
            action="Close"
            autoHideDuration={4000}
            onActionClick={this.handleRequestClose}
            onRequestClose={this.handleRequestClose}
          />
          { isMobile() && <PullToRefreshSpinner /> }
        </div>
      </div>
    )
  }
}
