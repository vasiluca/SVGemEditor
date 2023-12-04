function Export(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob){ // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
        return true;
    }
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        return true;
    }

    return false;
}
export {Export}