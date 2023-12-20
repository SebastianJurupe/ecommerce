export const home = {
  option: [
    {
      title: 'Envio a domicilio'
    }
  ],
  information: [
    {

      iconos: [
        { class: 'icon icon--location' },
        { class: 'icon icon--location' },
        { class: 'icon icon--calendar' },
        { class: 'icon icon--profile' },
        { class: 'icon icon--paper-negative' },
      ],
      text: [
        { text: 'Envío express', clickFunction: 'shippingOptions' },
        { text: 'agregar dirección', clickFunction: 'myAddresses' },
        { text: 'Llega el 26 dic, 8:00am - 9:00am', clickFunction: 'calendar' },
        { text: '¿quien recibirá el pedido?', clickFunction: 'showOrderReceiverModal' },
        { text: 'Requisitos para la entrega', clickFunction: 'deliveryRequirimients' },
        { text: 'La Samaritana Peruana', clickFunction: 'addBilling' },
      ],
      shippingHome: [
        { icono: '/assets/images/test1.jpg', label: 'Envío express', price: '12.50', details: 'Entrega en 1 dia', bestPrice: true },
        { icono: '/assets/images/test1.jpg', label: 'Envío regular', price: '200.80', details: 'Escoge la fecha y hora que quieres recibir tu pedido', bestrPrice: false },
      ],
    }
  ],
  methods: [
    {
      title: 'Agregar metodo de pago',
    }
  ],
};

export const agency = {
  option: [
    {
      title: 'Agencia de carga'
    }
  ],
  information: [
    {
      iconos: [
        { class: 'icon icon--truck' },
        { class: 'icon icon--profile' },
        { class: 'icon icon--paper-negative' },
      ],
      text: [
        { text: 'Elegir agencia', clickFunction: 'shippingOptions' },
        { text: '¿quien recogerá el pedido?', clickFunction: 'showOrderReceiverModal' },
        { text: 'Requisitos para la entrega', clickFunction: 'deliveryRequirimients' },
      ],
      shippingHome: [
        { icono: '/assets/images/test1.jpg', label: 'Shalom', price: '300', details: 'jr. Tupac amaru ii', bestPrice: true },
        { icono: '/assets/images/test1.jpg', label: 'Shalom', price: '25.00', details: 'jr Tupac amaru ii', bestPrice: false },
        { icono: '/assets/images/test1.jpg', label: 'Olva Courier', price: '40.00', details: 'Jr. Tupac amaru II, Villa el salvador, Lima, lima', bestPrice: true },
        { icono: '/assets/images/test1.jpg', label: 'Logisber', price: '33.00', details: 'Jr. Tupac amaru II, Villa el salvador, Lima', bestPrice: false },
        { icono: '/assets/images/test1.jpg', label: 'Cruz del sur cargo', price: '50.00', details: 'Jr. Tupac amaru II', bestPrice: true },
      ],
    }
  ],
  methods: [
    {
      title: 'Agregar metodo de pago'
    }
  ]
};

export const shop = {
  option: [
    {
      title: 'Recojo en tienda'
    }
  ],
  information: [
    {
      iconos: [
        { class: 'icon icon--location' },
        { class: 'icon icon--profile' },
      ],
      text: [
        { text: 'elegir tienda', clickFunction: 'shippingOptions' },
        { text: '¿quien recibirá el pedido?', clickFunction: 'showOrderReceiverModal' },
      ],
      shippingHome: [
        { icono: '/assets/general/logo-chat.png', label: 'Renac Miraflores', details: 'Jr. Samaritanos 879  Miraflores, Lima, Lima, Perú', },
        { icono: '/assets/general/logo-chat.png', label: 'Renac Chorrillos', details: 'Jr. Samaritanos 879  Miraflores, Lima, Lima, Perú', },
        { icono: '/assets/images/test1.jpg', label: 'Tambo', details: 'Jr. Samaritanos 879  Miraflores, Lima, Lima, Perú', },
      ],
    }
  ],
  methods: [
    {
      title: 'Agregar metodo de pago'
    }
  ]
};