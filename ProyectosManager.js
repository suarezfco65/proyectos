class ProyectosManager {
    constructor(url) {
        this.url = url;
    }

    // Método para cargar el archivo JSON
    async cargarJSON() {
        const response = await fetch(this.url);
        if (!response.ok) {
            throw new Error(`Error al cargar el JSON: ${response.statusText}`);
        }
        return await response.json();
    }

    // Método para buscar un registro por código
    buscarRegistroPorCodigo(data, codigo) {
        return data.find(registro => registro.Código === codigo);
    }

    // Método para mostrar el contenido del registro en formato HTML
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

    // Método para formatear valores
    formatearValor(key, value) {
        if (Array.isArray(value)) {
            return value.map(item => this.formatearObjeto(item)).join(', ');
        } else if (typeof value === 'number') {
            if (key.includes('Monto')) {
                return this.formatoFinanciero(value);
            } else if (key === 'Ejecución Física' || key === 'Ejecución Financiera') {
                return `${value.toFixed(2)}%`;
            }
        }
        return value;
    }

    // Método para formatear montos en formato financiero
    formatoFinanciero(monto) {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(monto);
    }

    // Método para generar una tabla a partir de los datos de proyectos
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

        // Sumar montos
        let totalMonto = 0;
        let hayMontos = false;

        datos.forEach(registro => {
            const fila = campos.map(campo => {
                const valor = registro[campo];
                if (campo.includes('Monto') && typeof valor === 'number') {
                    totalMonto += valor; // Sumar montos
                    hayMontos = true; // Indicar que hay montos
                }
                return `<td>${this.formatearValor(campo, valor)}</td>`;
            }).join('');
            tabla += `<tr>${fila}</tr>`;
        });

        // Solo mostrar total si hay montos
        if (hayMontos) {
            tabla += `
                    </tbody>
                </table>
                <h5>Total Monto: ${this.formatoFinanciero(totalMonto)}</h5>
            `;
        } else {
            tabla += `
                    </tbody>
                </table>
            `;
        }

        document.body.innerHTML += tabla;
    }

    // Método principal para ejecutar la lógica
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
