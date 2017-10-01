import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';


export class Home extends React.Component<RouteComponentProps<{}>, State> {
    constructor() {
        super();
        this.state = {
            text: '',
            formatType: 'xml',
            formatText: "",
            separatorCvs: ','
        }
    }

    public sendText(value: TextToSerializer) {

        let accept: string = value.formatType == "cvs" ? 'text/plain' : 'text/xml';
        let headers = new Headers({ 'Content-Type': 'application/json', "Accept": accept });
        let initFetch = { method: "POST", headers: headers, body: JSON.stringify(value) };

        fetch('api/TextSerializer', initFetch)
            .then(response => response.text())
            .then(data => {
                console.log(data);
                this.setState({ formatText: data });
            });
    }

    public handleTextSend() {
        this.sendText({
            text: this.state.text,
            formatType: this.state.formatType,
            separatorCvs: this.state.separatorCvs
        });
    }

    public handleTextChange(event: any):void {
        this.setState({ text: event.target.value })
    }

    public handleFormatTypeChange(event: any): void {
        this.setState({ formatType: event.target.value })
    }

    public handleSeparatorCvsTypeChange(event: any): void {
        this.setState({ separatorCvs: event.target.value })
    }

    public formatXml(xml:any) {
        var formatted = '';
        var reg = /(>)(<)(\/*)/g;
        xml = xml.replace(reg, '$1\r\n$2$3');
        var pad = 0;
        var xmlArr = xml.split('\r\n');
        var xmlMap = xmlArr.map(function (node: any, index: any) {
            
            var indent = 0;
            if (node.match(/.+<\/\w[^>]*>$/)) {
                indent = 0;
            } else if (node.match(/^<\/\w/)) {
                if (pad != 0) {
                    pad -= 1;
                }
            } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
                indent = 1;
            } else {
                indent = 0;
            }

            var padding = '';
            for (var i = 0; i < pad; i++) {
                padding += '\t';
            }

            formatted += padding + node + '\r\n';
            pad += indent;
        })

        return formatted;
    }

    public render() {
        return (
            <div>
                <form>
                    <div className="form-group">
                        <label >Example textarea*</label>
                        <textarea className="form-control" onChange={(event) => this.handleTextChange(event)} rows={8} maxLength={2500} max={100} required></textarea>
                    </div>
                    <div className="form-group">
                        <label>Format*</label>
                        <div className="form-check form-check-inline">
                            <label className="form-check-label">
                                <input className="form-check-input" type="radio" name="formatType" id="inlineRadio1" value="xml"
                                    checked={this.state.formatType == 'xml'} onChange={(event) => this.handleFormatTypeChange(event)} required/>xml
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <label className="form-check-label">
                                <input className="form-check-input" type="radio" name="formatType" id="inlineRadio2" value="cvs"
                                    checked={this.state.formatType == 'cvs'} onChange={(event) => this.handleFormatTypeChange(event)} required/>cvs
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Separator</label>
                        <div className="form-check form-check-inline">
                            <label className="form-check-label">
                                <input className="form-check-input" disabled={this.state.formatType != "cvs"} type="radio" name="separatorCvs"
                                    id="inlineRadio3" value="," checked={this.state.separatorCvs == ','} onChange={(event) => this.handleSeparatorCvsTypeChange(event)} />comma
                            </label>
                        </div>
                        <div className="form-check form-check-inline">
                            <label className="form-check-label">
                                <input className="form-check-input" disabled={this.state.formatType != "cvs"} type="radio" name="separatorCvs"
                                    id="inlineRadio4" value="||" checked={this.state.separatorCvs == '||'} onChange={(event) => this.handleSeparatorCvsTypeChange(event)} />||
                            </label>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-10">
                            <button type="button" className="btn btn-primary" onClick={() => this.handleTextSend()}>Format</button>
                        </div>
                    </div>
                </form>
                <div className="console" style={{ whiteSpace: 'pre', border: '1px solid lightgray', overflow: 'auto' }} >{this.formatXml(this.state.formatText)}</div>
            </div>);
    }
}

interface State {
    text: string,
    formatType: string,
    formatText: any,
    separatorCvs: string
}

interface TextToSerializer {
    text: string,
    formatType: string,
    separatorCvs: string
}
