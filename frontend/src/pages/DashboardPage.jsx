import { useState, useEffect } from 'react';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Activity,
  Clock,
  Database,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import './App.css';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authenticatedFetch } = useAuth();

  const fetchDashboardData = async () => {
    try {
      const response = await authenticatedFetch('/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data.data);
      } else {
        toast.error('Erreur lors du chargement du tableau de bord');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const forceValidation = async () => {
    try {
      const response = await authenticatedFetch('/admin/force-validation', {
        method: 'POST'
      });
      
      if (response.ok) {
        toast.success('Validation manuelle démarrée');
        // Recharger les données après quelques secondes
        setTimeout(fetchDashboardData, 3000);
      } else {
        const data = await response.json();
        toast.error(data.message || 'Erreur lors de la validation');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la validation');
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Actualiser toutes les 30 secondes
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Impossible de charger les données du tableau de bord</p>
        <Button onClick={fetchDashboardData} className="mt-4">
          Réessayer
        </Button>
      </div>
    );
  }

  const { statistics, validatorStatus, systemInfo, recentActivity } = dashboardData;
  const validationRate = statistics.totalBlocks > 0 
    ? ((statistics.validBlocks / statistics.totalBlocks) * 100).toFixed(1)
    : 100;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble du nœud de validation CDSEC
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchDashboardData} variant="outline">
            Actualiser
          </Button>
          <Button onClick={forceValidation}>
            Forcer la validation
          </Button>
        </div>
      </div>

      {/* Statut du validateur */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Statut du validateur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${validatorStatus.isRunning ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {validatorStatus.isRunning ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-sm font-medium">État</p>
                <p className="text-xs text-muted-foreground">
                  {validatorStatus.isRunning ? 'En fonctionnement' : 'Arrêté'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Validation auto</p>
                <p className="text-xs text-muted-foreground">
                  {validatorStatus.autoValidationEnabled ? 'Activée' : 'Désactivée'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Uptime</p>
                <p className="text-xs text-muted-foreground">
                  {Math.floor(validatorStatus.uptime / 3600)}h {Math.floor((validatorStatus.uptime % 3600) / 60)}m
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocs validés</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalBlocks}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.validBlocks} valides, {statistics.invalidBlocks} invalides
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de validité</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{validationRate}%</div>
            <Progress value={parseFloat(validationRate)} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anomalies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalAnomalies}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.unresolvedAnomalies} non résolues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernière validation</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {statistics.lastValidation 
                ? new Date(statistics.lastValidation).toLocaleString('fr-FR')
                : 'Aucune'
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Dernières validations et anomalies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                    <div className={`p-1 rounded-full ${
                      activity.type === 'validation' 
                        ? activity.status === '1' || activity.status === true
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                        : 'bg-orange-100 text-orange-600'
                    }`}>
                      {activity.type === 'validation' ? (
                        activity.status === '1' || activity.status === true ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )
                      ) : (
                        <AlertTriangle className="h-3 w-3" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {activity.type === 'validation' ? 'Validation' : 'Anomalie'}
                        {activity.block_id && ` - ${activity.block_id.substring(0, 8)}...`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    <Badge variant={
                      activity.type === 'validation' 
                        ? activity.status === '1' || activity.status === true ? 'default' : 'destructive'
                        : 'secondary'
                    }>
                      {activity.type === 'validation' 
                        ? activity.status === '1' || activity.status === true ? 'Valide' : 'Invalide'
                        : 'Détectée'
                      }
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune activité récente
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations système</CardTitle>
            <CardDescription>État du nœud validateur</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Nœud ID</span>
                <span className="text-sm text-muted-foreground">{systemInfo.nodeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Organisation</span>
                <span className="text-sm text-muted-foreground">{systemInfo.organization}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Version Node.js</span>
                <span className="text-sm text-muted-foreground">{systemInfo.nodeVersion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Mémoire utilisée</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(systemInfo.memoryUsage.heapUsed / 1024 / 1024)} MB
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Dernière mise à jour</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(systemInfo.timestamp).toLocaleString('fr-FR')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

