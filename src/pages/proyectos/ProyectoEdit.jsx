import React from 'react';
import EntityFormPage from '../../components/EntityFormPage';
import proyectosService from '../../services/proyectosService';
export default function ProyectoEdit() { return <EntityFormPage title="Editar proyecto" description="Actualizá la información del proyecto seleccionado." service={proyectosService} basePath="/admin/proyectos" kind="proyecto" fields={['titulo', 'descripcion', 'imagen', 'tecnologias', 'repositorio', 'demo', 'estado']} />; }
