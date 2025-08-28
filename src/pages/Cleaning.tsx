import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, CheckCircle, Clock, User, Calendar, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CleaningTask {
  id: string;
  roomNumber: string;
  type: 'checkout' | 'maintenance' | 'deep' | 'routine';
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo?: string;
  createdAt: string;
  completedAt?: string;
  estimatedMinutes: number;
  actualMinutes?: number;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
}

const Cleaning: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [tasks, setTasks] = useState<CleaningTask[]>([
    {
      id: '1',
      roomNumber: '101',
      type: 'checkout',
      status: 'pending',
      assignedTo: 'Ana Rodríguez',
      createdAt: '2024-01-15T08:00:00',
      estimatedMinutes: 45,
      priority: 'high'
    },
    {
      id: '2',
      roomNumber: '205',
      type: 'routine',
      status: 'in-progress',
      assignedTo: 'Carmen López',
      createdAt: '2024-01-15T09:30:00',
      estimatedMinutes: 30,
      actualMinutes: 25,
      priority: 'medium'
    },
    {
      id: '3',
      roomNumber: '312',
      type: 'deep',
      status: 'completed',
      assignedTo: 'María García',
      createdAt: '2024-01-14T14:00:00',
      completedAt: '2024-01-14T16:30:00',
      estimatedMinutes: 120,
      actualMinutes: 140,
      priority: 'low'
    }
  ]);

  const [newTask, setNewTask] = useState({
    roomNumber: '',
    type: 'checkout' as CleaningTask['type'],
    assignedTo: '',
    estimatedMinutes: 45,
    priority: 'medium' as CleaningTask['priority'],
    notes: ''
  });

  const getTypeColor = (type: CleaningTask['type']) => {
    switch (type) {
      case 'checkout': return 'bg-red-600 text-white';
      case 'maintenance': return 'bg-orange-600 text-white';
      case 'deep': return 'bg-purple-600 text-white';
      case 'routine': return 'bg-blue-600 text-white';
    }
  };

  const getStatusColor = (status: CleaningTask['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-500 text-white';
      case 'in-progress': return 'bg-yellow-600 text-white';
      case 'completed': return 'bg-green-600 text-white';
    }
  };

  const getPriorityColor = (priority: CleaningTask['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getTypeText = (type: CleaningTask['type']) => {
    switch (type) {
      case 'checkout': return 'Post Check-out';
      case 'maintenance': return 'Post Mantenimiento';
      case 'deep': return 'Limpieza Profunda';
      case 'routine': return 'Limpieza Rutinaria';
    }
  };

  const handleCreateTask = () => {
    if (!newTask.roomNumber) {
      toast({
        title: "Error",
        description: "Por favor ingrese el número de habitación",
        variant: "destructive"
      });
      return;
    }

    const task: CleaningTask = {
      id: (tasks.length + 1).toString(),
      ...newTask,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, task]);
    setNewTask({
      roomNumber: '',
      type: 'checkout',
      assignedTo: '',
      estimatedMinutes: 45,
      priority: 'medium',
      notes: ''
    });

    toast({
      title: "Tarea creada",
      description: `Tarea de limpieza para habitación ${task.roomNumber} creada exitosamente`,
    });
  };

  const handleStatusChange = (taskId: string, newStatus: CleaningTask['status']) => {
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

  const TaskCard: React.FC<{ task: CleaningTask }> = ({ task }) => (
    <Card className="dashboard-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Habitación {task.roomNumber}</CardTitle>
          <div className="flex gap-2">
            <Badge className={getPriorityColor(task.priority)} variant="outline">
              {task.priority.toUpperCase()}
            </Badge>
            <Badge className={getStatusColor(task.status)}>
              {task.status.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>
        <CardDescription>
          <Badge className={getTypeColor(task.type)} variant="secondary">
            {getTypeText(task.type)}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{task.assignedTo || 'Sin asignar'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{task.estimatedMinutes}min estimados</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(task.createdAt).toLocaleDateString('es-PY')}</span>
          </div>
          {task.actualMinutes && (
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>{task.actualMinutes}min trabajados</span>
            </div>
          )}
        </div>

        {task.notes && (
          <div className="text-xs p-2 bg-muted/50 rounded border">
            📝 {task.notes}
          </div>
        )}

        <div className="flex gap-2 pt-3">
          {task.status === 'pending' && (
            <Button 
              size="sm" 
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
              onClick={() => handleStatusChange(task.id, 'in-progress')}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Iniciar
            </Button>
          )}
          {task.status === 'in-progress' && (
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleStatusChange(task.id, 'completed')}
            >
              <CheckCircle className="w-3 h-3 mr-1" />
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
            {t('sidebar.cleaning')}
          </h1>
          <p className="text-muted-foreground mt-1">
            Control de limpieza de habitaciones
          </p>
        </div>

        {/* Create New Task */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-hotel-navy hover:bg-hotel-navy/90 text-white">
              <Sparkles className="w-4 h-4 mr-2" />
              Nueva Tarea
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Tarea de Limpieza</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Habitación</label>
                <Select value={newTask.roomNumber} onValueChange={(value) => setNewTask({...newTask, roomNumber: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar habitación" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 100}, (_, i) => (i + 1).toString().padStart(3, '0')).map(num => (
                      <SelectItem key={num} value={num}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Tipo de Limpieza</label>
                <Select value={newTask.type} onValueChange={(value) => setNewTask({...newTask, type: value as CleaningTask['type']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checkout">Post Check-out</SelectItem>
                    <SelectItem value="maintenance">Post Mantenimiento</SelectItem>
                    <SelectItem value="deep">Limpieza Profunda</SelectItem>
                    <SelectItem value="routine">Limpieza Rutinaria</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Prioridad</label>
                <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value as CleaningTask['priority']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Asignado a</label>
                <Select value={newTask.assignedTo} onValueChange={(value) => setNewTask({...newTask, assignedTo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empleado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ana Rodríguez">Ana Rodríguez</SelectItem>
                    <SelectItem value="Carmen López">Carmen López</SelectItem>
                    <SelectItem value="María García">María García</SelectItem>
                    <SelectItem value="Isabel Morales">Isabel Morales</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Notas (opcional)</label>
                <Textarea
                  placeholder="Instrucciones especiales..."
                  value={newTask.notes}
                  onChange={(e) => setNewTask({...newTask, notes: e.target.value})}
                />
              </div>

              <Button onClick={handleCreateTask} className="w-full bg-hotel-navy hover:bg-hotel-navy/90 text-white">
                <Sparkles className="w-4 h-4 mr-2" />
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
              <div className="text-2xl font-bold text-yellow-600">{tasks.filter(t => t.status === 'in-progress').length}</div>
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
              <div className="text-2xl font-bold text-red-600">{tasks.filter(t => t.priority === 'high').length}</div>
              <div className="text-sm text-muted-foreground">Alta Prioridad</div>
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

export default Cleaning;