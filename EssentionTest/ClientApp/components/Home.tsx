import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';


export class Home extends React.Component<RouteComponentProps<{}>, State> {
    constructor() {
        super();
        this.state = {
            text: '',
            formatType: 'xml',
            formatText: ""
        }
    }

    public sendText(value: any) {

        let accept: string = value.formatType == "cvs" ? 'text/plain' : 'text/xml';
        let headers = new Headers({ 'Content-Type': 'application/json', "Accept": accept });
        let initFetch = { method: "POST", headers: headers, body: JSON.stringify(value) };

        fetch('api/TextSerializer', initFetch)
            .then(response => response.text())
            .then(data => {
                this.setState({ formatText: data });
            });
    }

    public handleTextSend() {
        let value = { text: this.state.text,formatType: this.state.formatType };

        this.sendText(value);
    }

    public handleTextChange(event: any):void {
        this.setState({ text: event.target.value })
    }

    public handleFormatTypeChange(event: any): void {
        this.setState({ formatType: event.target.value })
    }

    public render() {
        console.log(this.state.formatText);
        var consoleRender = this.state.formatText.split("\n").map((item: any, i: any) => {
            return (<p key={i}>{item}</p>);
        });
        return (
            <div>
                <form>
                    <div className="form-group">
                        <label >Example textarea</label>
                        <textarea className="form-control" onChange={(event) => this.handleTextChange(event)}></textarea>
                    </div>
                    <div className="form-group">
                        <div className="form-check form-check-inline">
                            <label className="form-check-label">
                                <input className="form-check-input" type="radio" name="formatType" id="inlineRadio1" value="xml" checked onChange={(event) => this.handleFormatTypeChange(event)} />xml
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <label className="form-check-label">
                                <input className="form-check-input" type="radio" name="formatType" id="inlineRadio2" value="cvs" onChange={(event) => this.handleFormatTypeChange(event)}/>cvs
                            </label>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-10">
                            <button type="button" className="btn btn-primary" onClick={() => this.handleTextSend()}>Format</button>
                        </div>
                    </div>
                </form>
                <div id="console">{consoleRender}</div>
            </div>);
    }
}

interface State {
    text: string,
    formatType: string,
    formatText: any
}
