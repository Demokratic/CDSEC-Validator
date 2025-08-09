import { useState, useEffect } from 'react';
import { 
  Shield, 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  Activity,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import './App.css';

export default function ValidatorPage() {
  const [validatorStatus, setValidatorStatus] = useState(null);
  const [validatedBlocks, setValidatedBlocks] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { authenticatedFetch } = useAuth();

  const fetchValidatorStatus = async () => {
    try {
      const response = await authenticatedFetch('/validator/status');
      if (response.ok) {
        const data = await response.json();
        setValidatorStatus(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchValidatedBlocks = async () => {
    try {
      const response = await authenticatedFetch('/validator/validated-blocks?limit=10');
      if (response.ok) {
        const data = await response.json();
        setValidatedBlocks(data.data.blocks);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await authenticatedFetch('/validator/statistics');
      if (response.ok) {
        const data = await response.json();
        setStatistics(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchPerformance = async () => {
    try {
      const response = await authenticatedFetch('/validator/performance?hours=24');
      if (response.ok) {
        const data = await response.json();
        setPerformance(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchValidatorStatus(),
        fetchValidatedBlocks(),
        fetchStatistics(),
        fetchPerformance()
      ]);
    } finally {
      setLoading(false);
    }
  };

  const forceValidation = async () => {
    setActionLoading(true);
    try {
      const response = await authenticatedFetch('/validator/validate', {
        method: 'POST'
      });
      
      if (response.ok) {
        toast.success('Validation manuelle démarrée');
        setTimeout(fetchAllData, 3000);
      } else {
        const data = await response.json();
        toast.error(data.message || 'Erreur lors de la validation');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la validation');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Validateur</h1>
          <p className="text-muted-foreground">
            Gestion et monitoring du service de validation
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchAllData} variant="outline" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button onClick={forceValidation} disabled={actionLoading}>
            {actionLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Forcer validation
          </Button>
        </div>
      </div>

      {/* Statut du validateur */}
      {validatorStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Statut du validateur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-orange-100 text-orange-600">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Mémoire</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(validatorStatus.memoryUsage.heapUsed / 1024 / 1024)} MB
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Onglets */}
      <Tabs defaultValue="statistics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="statistics">Statistiques</TabsTrigger>
          <TabsTrigger value="blocks">Blocs validés</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Statistiques */}
        <TabsContent value="statistics" className="space-y-4">
          {statistics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total blocs</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.totalBlocks}</div>
                  <p className="text-xs text-muted-foreground">
                    Blocs traités au total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blocs valides</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{statistics.validBlocks}</div>
                  <p className="text-xs text-muted-foreground">
                    Taux: {statistics.validationRate}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blocs invalides</CardTitle>
                  <XCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{statistics.invalidBlocks}</div>
                  <p className="text-xs text-muted-foreground">
                    Taux: {statistics.anomalyRate}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Dernières 24h</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.last24h.blocksValidated}</div>
                  <p className="text-xs text-muted-foreground">
                    Blocs validés
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {statistics && (
            <Card>
              <CardHeader>
                <CardTitle>Taux de validation</CardTitle>
                <CardDescription>Pourcentage de blocs valides</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Blocs valides</span>
                    <span>{statistics.validationRate}%</span>
                  </div>
                  <Progress value={parseFloat(statistics.validationRate)} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Blocs validés */}
        <TabsContent value="blocks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Derniers blocs validés</CardTitle>
              <CardDescription>Liste des 10 derniers blocs traités</CardDescription>
            </CardHeader>
            <CardContent>
              {validatedBlocks.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID du bloc</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Validation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validatedBlocks.map((block) => (
                      <TableRow key={block.id}>
                        <TableCell className="font-mono text-xs">
                          {block.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <Badge variant={block.is_valid ? "default" : "destructive"}>
                            {block.is_valid ? "Valide" : "Invalide"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {new Date(block.timestamp).toLocaleString('fr-FR')}
                        </TableCell>
                        <TableCell className="text-xs">
                          {new Date(block.validation_timestamp).toLocaleString('fr-FR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Aucun bloc validé trouvé
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance */}
        <TabsContent value="performance" className="space-y-4">
          {performance && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Temps de validation</CardTitle>
                  <CardDescription>Métriques des dernières 24h</CardDescription>
                </CardHeader>
                <CardContent>
                  {performance.metrics.validation_duration ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Temps moyen</span>
                        <span className="text-sm font-medium">
                          {Math.round(performance.metrics.validation_duration[0]?.value || 0)} ms
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Nombre de mesures</span>
                        <span className="text-sm font-medium">
                          {performance.metrics.validation_duration?.length || 0}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucune donnée disponible</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Blocs traités</CardTitle>
                  <CardDescription>Volume des dernières 24h</CardDescription>
                </CardHeader>
                <CardContent>
                  {performance.metrics.blocks_validated ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total traités</span>
                        <span className="text-sm font-medium">
                          {performance.metrics.blocks_validated.reduce((sum, metric) => sum + metric.value, 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Sessions de validation</span>
                        <span className="text-sm font-medium">
                          {performance.metrics.blocks_validated?.length || 0}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucune donnée disponible</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

