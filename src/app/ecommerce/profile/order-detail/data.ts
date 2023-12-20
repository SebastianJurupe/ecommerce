export const home = {
  deliveryType: {
    id: '01',
    label: 'Envío a domicilio',
    setBackground: true,
    classIconButton: 'icon icon--location icon--success',
    setArrow: false,
    type: 'home',
    shapeIconBackground: 'rectangle',
    shapeType: 'success',
  }
}

export const agency = {
  deliveryType: {
    id: '02',
    label: 'Agencia de carga',
    setBackground: true,
    classIconButton: 'icon icon--truck icon--error',
    setArrow: false,
    type: 'agency',
    shapeIconBackground: 'rectangle',
    shapeType: 'error',
  }
}

export const shop = {
  deliveryType:{
    id: '03',
    label: 'Recojo en tienda',
    setBackground: true,
    classIconButton: 'icon icon--store icon--info',
    setArrow: false,
    type: 'shop',
    shapeIconBackground: 'rectangle',
    shapeType: 'info',
  }
}

export const pendingPayment ={
  status:{
    id: '021',
    label: 'Pendiente de pago',
    sublabel: 'Prepararemos tu pedido una vez hayas hecho el pago',
    class:'order-status-error',
    span:{
      span1:'bar red',
      span2:'bar',
      span3:'bar',
      span4:'bar',
    }
  }
}

export const preparation ={
  status:{
    id: '022',
    label: 'En preparación',
    sublabel: 'Ya confirmamos tu pedido, se procederá a la preparaciòn',
    class:'order-status-warning',
    span:{
      span1:'bar orange',
      span2:'bar orange',
      span3:'bar',
      span4:'bar',
    }
  }
}

export const onTheWay ={
  status:{
    id: '023',
    label: 'En camino',
    sublabel: 'Tu pedido ya fue enviado a la dirección que indicaste',
    class:'order-status-info',
    span:{
      span1:'bar blue',
      span2:'bar blue',
      span3:'bar blue',
      span4:'bar',
    }
  }
}

export const delivered ={
  status:{
    id: '024',
    label: 'Entregado',
    sublabel: 'Tu pedido ya fue entregado en la dirección que indicaste',
    class:'order-status-success',
    span:{
      span1:'bar green',
      span2:'bar green',
      span3:'bar green',
      span4:'bar green',
    }
  }
}
