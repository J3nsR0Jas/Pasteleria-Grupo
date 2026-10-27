document.addEventListener('DOMContentLoaded', () => {
  let carrito = JSON.parse(localStorage.getItem('carrito_delicia')) || [];

  const contCarrito = document.getElementById('contador-carrito');
  const btnCarrito = document.getElementById('btn-carrito');
  const listaCarrito = document.getElementById('lista-carrito');
  const totalCarrito = document.getElementById('total-carrito');
  const rejilla = document.getElementById('rejilla-productos');
  const tarjetas = Array.from(document.querySelectorAll('.tarjeta-col'));
  const tabs = document.querySelectorAll('.tab');
  const selectOrden = document.getElementById('select-orden');
  const campoBusqueda = document.getElementById('campo-busqueda');
  const sinResultados = document.getElementById('sin-resultados');

  function actualizarCarritoUI() {
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    if (contCarrito) contCarrito.textContent = totalItems;

    if (listaCarrito) {
      listaCarrito.innerHTML = '';
      let totalPagar = 0;

      carrito.forEach((item, index) => {
        totalPagar += item.precio * item.cantidad;
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center py-2 px-0 border-bottom';
        li.innerHTML = `
          <div>
            <h6 class="m-0 fw-bold fs-7 text-dark">${item.nombre}</h6>
            <small class="text-muted">S/ ${item.precio.toFixed(2)} x ${item.cantidad}</small>
          </div>
          <button class="btn btn-sm btn-outline-danger border-0 rounded-circle btn-eliminar" data-index="${index}">✕</button>
        `;
        listaCarrito.appendChild(li);
      });

      if (totalCarrito) totalCarrito.textContent = `S/ ${totalPagar.toFixed(2)}`;
    }

    localStorage.setItem('carrito_delicia', JSON.stringify(carrito));
  }

  document.querySelectorAll('.btn-agregar').forEach(btn => {
    btn.addEventListener('click', () => {
      const nombre = btn.dataset.nombre;
      const precio = parseFloat(btn.dataset.precio);
      const existe = carrito.find(i => i.nombre === nombre);

      if (existe) {
        existe.cantidad++;
      } else {
        carrito.push({ nombre, precio, cantidad: 1 });
      }

      actualizarCarritoUI();

      if (btnCarrito) {
        btnCarrito.classList.remove('animar-rebote');

        void btnCarrito.offsetWidth;
        btnCarrito.classList.add('animar-rebote');
      }
    });
  });

  if (listaCarrito) {
    listaCarrito.addEventListener('click', e => {
      if (e.target.classList.contains('btn-eliminar')) {
        const index = e.target.dataset.index;
        carrito.splice(index, 1);
        actualizarCarritoUI();
      }
    });
  }

  document.querySelectorAll('.btn-toggle-detalle').forEach(btn => {
    btn.addEventListener('click', () => {
      const tarjetaCuerpo = btn.closest('.tp-cuerpo');
      const detalle = tarjetaCuerpo.querySelector('.detalle-desplegable');

      const estaAbierto = detalle.classList.contains('abierto');

      if (estaAbierto) {
        detalle.classList.remove('abierto');
        btn.textContent = 'Ver más ▾';
      } else {
        detalle.classList.add('abierto');
        btn.textContent = 'Ver menos ▴';
      }
    });
  });

  document.querySelectorAll('.tp-favorito').forEach(fav => {
    fav.addEventListener('click', () => {
      fav.classList.toggle('activo');
    });
  });

  function aplicarFiltrosYOrden() {
    const tabActiva = document.querySelector('.tab.activa');
    const cat = tabActiva ? tabActiva.dataset.categoria : 'todas';
    const busqueda = campoBusqueda ? campoBusqueda.value.toLowerCase().trim() : '';
    const orden = selectOrden ? selectOrden.value : 'defecto';

    let visibles = tarjetas.filter(card => {
      const coincideCat = (cat === 'todas' || card.dataset.categoria === cat);
      const coincideBusqueda = card.dataset.nombre.toLowerCase().includes(busqueda);
      return coincideCat && coincideBusqueda;
    });

    if (orden === 'precio-menor') {
      visibles.sort((a, b) => parseFloat(a.dataset.precio) - parseFloat(b.dataset.precio));
    } else if (orden === 'precio-mayor') {
      visibles.sort((a, b) => parseFloat(b.dataset.precio) - parseFloat(a.dataset.precio));
    } else if (orden === 'nombre') {
      visibles.sort((a, b) => a.dataset.nombre.localeCompare(b.dataset.nombre));
    }

    tarjetas.forEach(card => card.style.display = 'none');
    visibles.forEach(card => {
      rejilla.appendChild(card);
      card.style.display = 'block';
    });

    if (sinResultados) {
      sinResultados.style.display = visibles.length === 0 ? 'block' : 'none';
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('activa'));
      tab.classList.add('activa');
      aplicarFiltrosYOrden();
    });
  });

  if (selectOrden) selectOrden.addEventListener('change', aplicarFiltrosYOrden);
  if (campoBusqueda) campoBusqueda.addEventListener('input', aplicarFiltrosYOrden);

  actualizarCarritoUI();
  aplicarFiltrosYOrden();
});