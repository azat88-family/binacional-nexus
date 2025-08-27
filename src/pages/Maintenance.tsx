import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wrench, AlertTriangle, CheckCircle, Clock, User, Calendar, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MaintenanceTask {
  id: string;
  roomNumber: string;
  type: 'preventive' | 'corrective' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo?: string;
  createdAt: string;
  completedAt?: string;
  estimatedHours: number;
  actualHours?: number;
}

const Maintenance: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [tasks, setTasks] = useState<MaintenanceTask[]>([
    {
      id: '1',
      roomNumber: '101',
      type: 'corrective',
      priority: 'high',
      description: 'Aire acondicionado no enfría correctamente',
      status: 'pending',
      assignedTo: 'Juan Pérez',
      createdAt: '2024-01-15T08:00:00',
      estimatedHours: 3
    },
    {
      id: '2',
      roomNumber: '205',
      type: 'preventive',
      priority: 'medium',
      description: 'Mantenimiento mensual de baño',
      status: 'in-progress',
      assignedTo: 'María García',
      createdAt: '2024-01-14T10:30:00',
      estimatedHours: 2,
      actualHours: 1.5
    },
    {
      id: '3',
      roomNumber: '312',
      type: 'emergency',
      priority: 'urgent',
      description: 'Fuga de agua en baño principal',
      status: 'pending',
      createdAt: '2024-01-15T14:45:00',
      estimatedHours: 4
    }
  ]);

  const [newTask, setNewTask] = useState({
    roomNumber: '',
    type: 'corrective' as MaintenanceTask['type'],
    priority: 'medium' as MaintenanceTask['priority'],
    description: '',
    assignedTo: '',
    estimatedHours: 1
  });

  const getPriorityColor = (priority: MaintenanceTask['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'low': return 'bg-green-600 text-white';
    }
  };

  const getStatusColor = (status: MaintenanceTask['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-500 text-white';
      case 'in-progress': return 'bg-blue-600 text-white';
      case 'completed': return 'bg-green-600 text-white';
    }
  };

  const getTypeIcon = (type: MaintenanceTask['type']) => {
    switch (type) {
      case 'preventive': return <CheckCircle className="w-4 h-4" />;
      case 'corrective': return <Wrench className="w-4 h-4" />;
      case 'emergency': return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const handleCreateTask = () => {
    if (!newTask.roomNumber || !newTask.description) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    const task: MaintenanceTask = {
      id: (tasks.length + 1).toString(),
      ...newTask,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, task]);
    setNewTask({
      roomNumber: '',
      type: 'corrective',
      priority: 'medium',
      description: '',
      assignedTo: '',
      estimatedHours: 1
    });

    toast({
      title: "Tarea creada",
      description: `Tarea de mantenimiento para habitación ${task.roomNumber} creada exitosamente`,
    });
  };

  const handleStatusChange = (taskId: string, newStatus: MaintenanceTask['status']) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, status: newStatus };
        if (newStatus === 'completed') {
          updatedTask.completedAt = new Date().toISOString();
        }
        return updatedTask;
      }
      return task;
    }));

    toast({
      title: "Estado actualizado",
      description: `Tarea marcada como ${newStatus === 'completed' ? 'completada' : newStatus}`,
    });
  };

  const TaskCard: React.FC<{ task: MaintenanceTask }> = ({ task }) => (
    <Card className="dashboard-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Habitación {task.roomNumber}</CardTitle>
          <div className="flex gap-2">
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority.toUpperCase()}
            </Badge>
            <Badge className={getStatusColor(task.status)}>
              {task.status.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>
        <CardDescription className="flex items-center gap-2">
          {getTypeIcon(task.type)}
          {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm">{task.description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{task.assignedTo || 'Sin asignar'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{task.estimatedHours}h estimadas</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(task.createdAt).toLocaleDateString('es-PY')}</span>
          </div>
          {task.actualHours && (
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>{task.actualHours}h trabajadas</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-3">
          {task.status === 'pending' && (
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => handleStatusChange(task.id, 'in-progress')}
            >
              Iniciar
            </Button>
          )}
          {task.status === 'in-progress' && (
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleStatusChange(task.id, 'completed')}
            >
              Completar
            </Button>
          )}
          {task.status === 'completed' && (
            <Badge className="bg-green-600 text-white">
              <CheckCircle className="w-3 h-3 mr-1" />
              Completada
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/rooms')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver a Habitaciones
            </Button>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-hotel-red to-hotel-navy bg-clip-text text-transparent mt-2">
            {t('sidebar.maintenance')}
          </h1>
          <p className="text-muted-foreground mt-1">
            Control de mantenimiento de habitaciones
          </p>
        </div>

        {/* Create New Task */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-hotel-red hover:bg-hotel-red/90 text-white">
              <Wrench className="w-4 h-4 mr-2" />
              Nueva Tarea
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Tarea de Mantenimiento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Habitación</label>
                <Input
                  placeholder="Ej: 101"
                  value={newTask.roomNumber}
                  onChange={(e) => setNewTask({...newTask, roomNumber: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Tipo</label>
                <Select value={newTask.type} onValueChange={(value) => setNewTask({...newTask, type: value as MaintenanceTask['type']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preventive">Preventivo</SelectItem>
                    <SelectItem value="corrective">Correctivo</SelectItem>
                    <SelectItem value="emergency">Emergencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Prioridad</label>
                <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value as MaintenanceTask['priority']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Descripción</label>
                <Textarea
                  placeholder="Describe el problema o tarea..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Asignado a</label>
                <Input
                  placeholder="Nombre del técnico"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Horas estimadas</label>
                <Input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={newTask.estimatedHours}
                  onChange={(e) => setNewTask({...newTask, estimatedHours: parseFloat(e.target.value)})}
                />
              </div>

              <Button onClick={handleCreateTask} className="w-full bg-hotel-red hover:bg-hotel-red/90 text-white">
                Crear Tarea
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-500">{tasks.filter(t => t.status === 'pending').length}</div>
              <div className="text-sm text-muted-foreground">Pendientes</div>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{tasks.filter(t => t.status === 'in-progress').length}</div>
              <div className="text-sm text-muted-foreground">En Progreso</div>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{tasks.filter(t => t.status === 'completed').length}</div>
              <div className="text-sm text-muted-foreground">Completadas</div>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{tasks.filter(t => t.priority === 'urgent').length}</div>
              <div className="text-sm text-muted-foreground">Urgentes</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Maintenance;