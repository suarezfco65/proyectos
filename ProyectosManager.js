class ProyectosManager {
    constructor(url) {
        this.url = url;
    }

    async cargarJSON() {
        const response = await fetch(this.url);
        if (!response.ok) {
            throw new Error(`Error al cargar el JSON: ${response.statusText}`);
        }
        return await response.json();
    }

    buscarRegistroPorCodigo(data, codigo) {
        return data.find(registro => registro.Código === codigo);
    }

    mostrarContenidoRegistro(registro, mostrarCampos = false, campos = []) {
        if (!registro) {
            document.body.innerHTML += '<p>No hay registro para mostrar.</p>';
            return;
        }

        let contenido = '<div class="container mt-4"><h2>Contenido del Registro</h2><ul class="list-group">';
        
        for (const [key, value] of Object.entries(registro)) {
            if (mostrarCampos && campos.includes(key)) {
                contenido += `<li class="list-group-item"><strong>${key}:</strong> ${this.formatearValor(key, value)}</li>`;
            } else if (!mostrarCampos) {
                contenido += `<li class="list-group-item"><strong>${key}:</strong> ${this.formatearValor(key, value)}</li>`;
            }
        }
        contenido += '</ul></div>';
        document.body.innerHTML += contenido;
    }

    formatearValor(key, value) {
        // Verificar si el valor es un objeto
        if (typeof value === 'object' && value !== null) {
            return this.formatearObjeto(value);
        } else if (Array.isArray(value)) {
            return value.map(item => this.formatearValor(key, item)).join(', ');
        } else if (typeof value === 'number') {
            return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value);
        }
        return value;
    }

    formatearObjeto(obj) {
        const etiqueta = Array.isArray(obj) ? 'ol' : 'ul';
        // Formatear un objeto como una lista
        return `<${etiqueta}>${Object.entries(obj).map(([key, value]) => `<li>${etiqueta === 'ol' ?'':`<strong>${key}:</strong>`} ${this.formatearValor(key, value)}</li>`).join('')}</${etiqueta}>`;
    }

    async generarTabla(titulo, campos) {
        const datos = await this.cargarJSON();
        let tabla = `
            <div class="container mt-4">
                <h2>${titulo}</h2>
                <table class="table table-striped">
                    <thead>
                        <tr>${campos.map(campo => `<th>${campo}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
        `;

        datos.forEach(registro => {
            const fila = campos.map(campo => `<td>${this.formatearValor(campo, registro[campo])}</td>`).join('');
            tabla += `<tr>${fila}</tr>`;
        });

        tabla += `
                    </tbody>
                </table>
            </div>
        `;
        document.body.innerHTML += tabla;
    }

    async main(codigoBuscado, mostrarCampos = false, campos = []) {
        try {
            const datos = await this.cargarJSON();
            const registro = this.buscarRegistroPorCodigo(datos, codigoBuscado);
            this.mostrarContenidoRegistro(registro, mostrarCampos, campos);
        } catch (error) {
            console.error(error);
        }
    }
}
